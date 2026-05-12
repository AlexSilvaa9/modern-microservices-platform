package com.microservices.cart.controller;

import com.microservices.cart.service.ShoppingCartService;
import com.microservices.core.common.dto.BaseApiResponse;
import com.microservices.core.common.dto.ShoppingCartDTO;
import org.jspecify.annotations.NullMarked;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * REST controller managing shopping cart operations.
 * Exposes endpoints for retrieving, updating, and clearing a user's cart.
 */
@RestController
public class CartController {

    /** Service handling core shopping cart business logic. */
    private final ShoppingCartService cartService;

    /**
     * Constructs a new CartController.
     *
     * @param cartService the shopping cart service
     */
    public CartController(ShoppingCartService cartService) {
        this.cartService = cartService;
    }

    /**
     * Retrieves the shopping cart for the currently authenticated user.
     * If a cart does not exist, a new empty cart is created.
     *
     * @param authentication the current security context containing the user's email
     * @return a successful response containing the user's shopping cart
     */
    @GetMapping
    @NullMarked
    public ResponseEntity<BaseApiResponse<ShoppingCartDTO>> getCart(Authentication authentication) {
        if (!authentication.isAuthenticated()) {
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
     * Adds a single unit of a product to the user's shopping cart.
     *
     * @param authentication the current security context containing the user's email
     * @param productId      the unique identifier of the product to add
     * @return a successful response indicating the item was added
     */
    @GetMapping("/add/{productId}")
    @NullMarked
    public ResponseEntity<BaseApiResponse<Object>> addItem(Authentication authentication, @PathVariable(name = "productId") UUID productId) {
        if (!authentication.isAuthenticated()) {
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
     * Removes a specified quantity of a product from the user's shopping cart.
     *
     * @param authentication the current security context containing the user's email
     * @param productId      the unique identifier of the product to remove
     * @param quantity       the quantity to remove (defaults to 1 if not provided)
     * @return a successful response indicating the item was removed
     */
    @GetMapping("/delete/{productId}")
    public ResponseEntity<BaseApiResponse<Object>> removeItem(
            Authentication authentication,
            @PathVariable(name = "productId") UUID productId,
            @RequestParam(name = "quantity", required = true) Long quantity) {
        if (!authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        String email = authentication.getName();
        cartService.removeProductFromCart(email, productId, quantity);
        BaseApiResponse<Object> body = new BaseApiResponse<>(
                "OK",
                null);
        return ResponseEntity.ok(body);
    }

    /**
     * Clears all items from the user's shopping cart.
     *
     * @param authentication the current security context containing the user's email
     * @return a successful response indicating the cart was emptied
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
