package com.microservices.cart.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Data Transfer Object exposing shopping cart details to the client.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShoppingCartDTO {
    /** The unique identifier of the shopping cart. */
    private UUID id;
    /** The email of the user who owns the cart. */
    private String userEmail;
    /** The list of items currently in the cart. */
    private List<CartItemDTO> items;
    /** Timestamp of cart creation. */
    private LocalDateTime createdAt;
    /** Timestamp of last cart update. */
    private LocalDateTime updatedAt;
}
