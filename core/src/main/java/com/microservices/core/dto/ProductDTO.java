package com.microservices.core.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Data Transfer Object representing a product exposed by the API.
 * Contains validation constraints for incoming requests.
 */
@Data
public class ProductDTO {

    /**
     * The unique identifier of the product.
     */
    private UUID id;

    /**
     * The name of the product. Must not be blank.
     */
    @NotBlank(message = "Product name is required")
    private String name;

    /**
     * A short or detailed description of the product.
     */
    private String description;

    /**
     * The price of the product. Must be a positive value.
     */
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;

    /**
     * The category to which the product belongs.
     */
    private String category;

    /**
     * The URL pointing to the product's image.
     */
    private String imageUrl;

}
