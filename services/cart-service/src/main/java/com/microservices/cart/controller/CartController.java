package com.microservices.cart.controller;

import com.microservices.cart.dto.CartItemDTO;
import com.microservices.cart.dto.ShoppingCartDTO;
import com.microservices.cart.service.ShoppingCartService;
import com.microservices.core.dto.BaseApiResponse;
import com.microservices.core.dto.ProductDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

/**
 * Controlador REST para operaciones del carrito de compras.
 */
@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "*")
public class CartController {

    private final ShoppingCartService cartService;

    public CartController(ShoppingCartService cartService) {
        this.cartService = cartService;
    }

    /**
     * Obtiene el carrito del usuario.
     *
     * @param authentication con  ID del usuario
     * @return ResponseEntity con el carrito o 404 si no existe
     */
    @GetMapping
    public ResponseEntity<BaseApiResponse<ShoppingCartDTO>> getCart(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();
        ShoppingCartDTO cart = cartService.getOrCreateCart(email);
        BaseApiResponse<ShoppingCartDTO> body = new BaseApiResponse<>(
                "OK",
                cart);
        return ResponseEntity.ok(body);

    }

    /**
     * Añade un item al carrito del usuario.
     *
     * @param item DTO del item a añadir
     * @return ResponseEntity con el carrito actualizado
     */
    @GetMapping("/add/{productId}")
    public ResponseEntity<BaseApiResponse<Object>> addItem(Authentication authentication, @PathVariable(name = "productId") UUID productId) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();
        cartService.addItemToCart(email, productId,1);
        BaseApiResponse<Object> body = new BaseApiResponse<>(
                "OK",
                null);
        return ResponseEntity.ok(body);

    }

    /**
     * Elimina un item del carrito del usuario.
     *
     * @param userId ID del usuario
     * @param itemId ID del item a eliminar
     * @return ResponseEntity con el carrito actualizado o 404 si no existe
     */
    @GetMapping("/delete/{productId}")
    public ResponseEntity<BaseApiResponse<Object>> removeItem(
            Authentication authentication,
            @PathVariable(name = "productId") UUID productId,
            @RequestParam(name = "quantity", required = false) Long quantity) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        String email = authentication.getName();
        quantity = quantity == null ? 1: quantity;
        cartService.removeProductFromCart(email, productId, quantity);
        BaseApiResponse<Object> body = new BaseApiResponse<>(
                "OK",
                null);
        return ResponseEntity.ok(body);
    }

    /**
     * Limpia el carrito del usuario.
     *
     * @return ResponseEntity sin contenido
     */
    @DeleteMapping
    public ResponseEntity<BaseApiResponse<Object>> clearCart(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();
        cartService.clearCart(email);
        BaseApiResponse<Object> body = new BaseApiResponse<>(
                "OK",
                null);
        return ResponseEntity.ok(body);
    }
}
