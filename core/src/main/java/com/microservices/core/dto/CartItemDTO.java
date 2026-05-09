package com.microservices.core.dto;

import java.util.UUID;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Data Transfer Object exposing cart item details to the client.
 * Includes enriched product metadata fetched from the Product Service.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
    /** The unique identifier of the cart item. */
    private UUID id;
    /** The enriched product metadata. */
    private ProductDTO product;
    /** The unique identifier of the product. */
    private UUID productId;
    /** The quantity of the product in the cart. */
    private Integer quantity;
}
