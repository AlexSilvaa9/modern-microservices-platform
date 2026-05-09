package com.microservices.cart.service;

import java.util.*;
import java.util.stream.Collectors;


import com.microservices.cart.client.ProductServiceClient;
import com.microservices.cart.mapper.ShoppingCartMapper;
import com.microservices.core.dto.ProductDTO;
import com.microservices.core.dto.ShoppingCartDTO;
import com.microservices.core.dto.order.OrderDTO;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.microservices.cart.dao.ShoppingCartDAO;
import com.microservices.core.dto.CartItemDTO;
import com.microservices.cart.model.CartItemEntity;
import com.microservices.cart.model.ShoppingCartEntity;

/**
 * Core business logic service for managing shopping carts.
 * Interfaces with the Product Service via Feign Client to enrich cart items with product details.
 */
@Service
@Transactional
public class ShoppingCartService {

    /** Data access object for cart database operations. */
    private final ShoppingCartDAO dao;
    /** Mapper for converting ShoppingCart entities to DTOs. */
    private final ShoppingCartMapper shoppingCartMapper;
    /** Feign client for fetching product metadata from the Product Service. */
    private final ProductServiceClient productServiceClient;

    /**
     * Constructs a new ShoppingCartService.
     *
     * @param dao                  the shopping cart DAO
     * @param shoppingCartMapper   the shopping cart mapper
     * @param productServiceClient the product service client
     */
    public ShoppingCartService(ShoppingCartDAO dao, ShoppingCartMapper shoppingCartMapper, ProductServiceClient productServiceClient) {
        this.dao = dao;
        this.shoppingCartMapper = shoppingCartMapper;
        this.productServiceClient = productServiceClient;
    }


    /**
     * Retrieves the active shopping cart for a user.
     * If the user does not have a cart, a new empty cart is initialized.
     * The returned DTO is enriched with product metadata from the Product Service.
     *
     * @param userEmail the email of the user owning the cart
     * @return the enriched shopping cart DTO
     */
    public ShoppingCartDTO getOrCreateCart(String userEmail) {

        ShoppingCartEntity cart = dao.findByUserEmail(userEmail)
                .orElseGet(() -> {
                    ShoppingCartEntity newCart = new ShoppingCartEntity();
                    newCart.setUserEmail(userEmail);
                    newCart.setItems(new ArrayList<>());
                    return dao.save(newCart);
                });

        ShoppingCartDTO dto = shoppingCartMapper.toDTO(cart);

        enrichCart(dto);

        return dto;
    }

    /**
     * Enriches a shopping cart DTO by fetching product details for its items
     * via the Product Service Client in a batch request.
     *
     * @param cart the cart DTO to enrich
     */
    private void enrichCart(ShoppingCartDTO cart) {

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            return;
        }

        List<UUID> productIds = cart.getItems().stream()
                .map(CartItemDTO::getProductId)
                .distinct()
                .toList();

        List<ProductDTO> products = productServiceClient.getProductsByIds(productIds);

        Map<UUID, ProductDTO> productMap = products.stream()
                .collect(Collectors.toMap(ProductDTO::getId, p -> p));

        cart.getItems().forEach(item ->
            item.setProduct(productMap.get(item.getProductId()))
        );
    }
    /**
     * Adds a specific quantity of a product to the user's shopping cart.
     * Creates a cart if it doesn't exist, or increments the quantity if the product is already in the cart.
     *
     * @param userEmail the email of the user
     * @param productId the unique identifier of the product
     * @param quantity  the number of units to add
     */
    public void addItemToCart(String userEmail, UUID productId, int quantity) {

        ShoppingCartEntity cart = dao.findByUserEmail(userEmail)
                .orElseGet(() -> {
                    ShoppingCartEntity c = new ShoppingCartEntity();
                    c.setUserEmail(userEmail);
                    c.setItems(new ArrayList<>());
                    return dao.save(c);
                });

        // 1. buscar si ya existe el producto en el carrito
        Optional<CartItemEntity> existingItem = cart.getItems().stream()
                .filter(i -> i.getProductId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            // 2. si existe → incrementar cantidad
            CartItemEntity item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            // 3. si no existe → crear nuevo item
            CartItemEntity item = new CartItemEntity();
            item.setId(null);
            item.setProductId(productId);
            item.setQuantity(quantity);
            item.setCart(cart);

            cart.getItems().add(item);
        }

        dao.save(cart);
    }
    /**
     * Removes a specific quantity of a product from the user's cart.
     * If the quantity to remove exceeds or equals the current amount, the item is removed entirely.
     *
     * @param userEmail the email of the user
     * @param productId the unique identifier of the product
     * @param quantity  the number of units to remove
     * @throws IllegalStateException if the cart or product is not found
     */
    public void removeProductFromCart(String userEmail, UUID productId, Long quantity) {

        ShoppingCartEntity cart = dao.findByUserEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("Cart not found"));

        CartItemEntity item = cart.getItems().stream()
                .filter(i -> i.getProductId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Product not in cart"));

        // 1. si hay más de 1 → restar cantidad
        if (item.getQuantity() > quantity) {
            item.setQuantity((int) (item.getQuantity() - quantity));
        } else {
            // 2. si es 1 → eliminar item completo
            cart.getItems().remove(item);
        }

        dao.save(cart);
    }

    /**
     * Completely empties the user's shopping cart, removing all items.
     *
     * @param userEmail the email of the user
     */
    public void clearCart(String userEmail) {
        dao.findByUserEmail(userEmail).ifPresent(cart -> {
            cart.getItems().clear();
            dao.save(cart);
        });
    }

    @KafkaListener(topics = "order-paid-topic", groupId = "cart-group")
    public void handleOrderPaid(OrderDTO orderDTO) {
        clearCart(orderDTO.userEmail());
    }

}
