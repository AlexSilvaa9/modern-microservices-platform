package com.microservices.cart.service;

import java.util.*;
import java.util.stream.Collectors;


import com.microservices.cart.client.ProductServiceClient;
import com.microservices.cart.mapper.CartItemMapper;
import com.microservices.cart.mapper.ShoppingCartMapper;
import com.microservices.core.dto.ProductDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.microservices.cart.dao.ShoppingCartDAO;
import com.microservices.cart.dto.CartItemDTO;
import com.microservices.cart.dto.ShoppingCartDTO;
import com.microservices.cart.model.CartItemEntity;
import com.microservices.cart.model.ShoppingCartEntity;

/**
 * Servicio público que expone operaciones sobre carritos para clientes.
 *
 * Si existe un User Service disponible, se valida que el usuario esté activo
 * antes de crear o modificar carritos. El cliente de UserService se inyecta
 * opcionalmente, de forma que el servicio de carrito puede funcionar sin
 * depender del User Service durante pruebas locales o despliegues parciales.
 */
@Service
@Transactional
public class ShoppingCartService {

    private final ShoppingCartDAO dao;
    private final CartItemMapper cartItemMapper;
    private final ShoppingCartMapper shoppingCartMapper;
    private final ProductServiceClient productServiceClient;

    public ShoppingCartService(ShoppingCartDAO dao, CartItemMapper cartItemMapper, ShoppingCartMapper shoppingCartMapper, ProductServiceClient productServiceClient) {
        this.dao = dao;
        this.shoppingCartMapper = shoppingCartMapper;
        this.cartItemMapper = cartItemMapper;
        this.productServiceClient = productServiceClient;
    }


    /**
     * Obtiene el carrito del usuario si existe.
     *
     * @param userEmail identificador del usuario
     * @return Optional con el DTO del carrito
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

        cart.getItems().forEach(item -> {
            item.setProduct(productMap.get(item.getProductId()));
        });
    }
    /**
     * Añade un item al carrito del usuario (crea carrito si es necesario).
     *
     * @param userEmail identificador del usuario
     * @param itemDTO DTO del item a añadir
     * @return DTO del carrito actualizado
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
     * Elimina un item del carrito del usuario.
     *
     * @param userEmail identificador del usuario
     * @param itemId identificador del item
     * @return DTO del carrito actualizado
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
     * Limpia (vacía) el carrito del usuario.
     *
     * @param userEmail identificador del usuario
     */
    public void clearCart(String userEmail) {
        dao.findByUserEmail(userEmail).ifPresent(cart -> {
            cart.getItems().clear();
            dao.save(cart);
        });
    }

}
