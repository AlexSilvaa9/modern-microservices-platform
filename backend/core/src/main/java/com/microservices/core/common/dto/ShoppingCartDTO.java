package com.microservices.core.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

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
