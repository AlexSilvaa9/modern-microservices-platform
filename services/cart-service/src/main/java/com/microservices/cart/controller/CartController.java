package com.microservices.cart.controller;

import com.microservices.cart.dto.CartItemDTO;
import com.microservices.cart.dto.ShoppingCartDTO;
import com.microservices.cart.service.ShoppingCartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

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
     * @param userId ID del usuario
     * @return ResponseEntity con el carrito o 404 si no existe
     */
    @GetMapping("/{userId}")
    public ResponseEntity<ShoppingCartDTO> getCart(@PathVariable String userId) {
        Optional<ShoppingCartDTO> cart = cartService.getCartByUserId(userId);
        return cart.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Crea un carrito para el usuario si no existe.
     *
     * @param userId ID del usuario
     * @return ResponseEntity con el carrito creado
     */
    @PostMapping("/{userId}")
    public ResponseEntity<ShoppingCartDTO> createCart(@PathVariable String userId) {
        try {
            ShoppingCartDTO cart = cartService.createCartIfAbsent(userId);
            return ResponseEntity.ok(cart);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Añade un item al carrito del usuario.
     *
     * @param userId ID del usuario
     * @param item DTO del item a añadir
     * @return ResponseEntity con el carrito actualizado
     */
    @PostMapping("/{userId}/items")
    public ResponseEntity<ShoppingCartDTO> addItem(@PathVariable String userId, @RequestBody CartItemDTO item) {
        try {
            ShoppingCartDTO updatedCart = cartService.addItemToCart(userId, item);
            return ResponseEntity.ok(updatedCart);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Elimina un item del carrito del usuario.
     *
     * @param userId ID del usuario
     * @param itemId ID del item a eliminar
     * @return ResponseEntity con el carrito actualizado o 404 si no existe
     */
    @DeleteMapping("/{userId}/items/{itemId}")
    public ResponseEntity<ShoppingCartDTO> removeItem(@PathVariable String userId, @PathVariable Long itemId) {
        Optional<ShoppingCartDTO> updatedCart = cartService.removeItemFromCart(userId, itemId);
        return updatedCart.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Limpia el carrito del usuario.
     *
     * @param userId ID del usuario
     * @return ResponseEntity sin contenido
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable String userId) {
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
}
