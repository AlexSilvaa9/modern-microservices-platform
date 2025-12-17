package com.microservices.catalog.dto;

import java.math.BigDecimal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Builder;
import lombok.Data;

/**
 * DTO que representa los datos expuestos de un producto en la API.
 */
@Data
@Builder
public class ProductDTO {

    /** Identificador del producto */
    private Long id;

    /** Nombre del producto */
    @NotBlank(message = "Product name is required")
    private String name;

    /** Descripción corta o larga del producto */
    private String description;

    /** Precio del producto */
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;

    /** Cantidad en stock */
    @NotNull(message = "Stock is required")
    private Integer stock;

    /** Categoría del producto */
    private String category;

    /** URL de la imagen */
    private String imageUrl;

    /** Indica si el producto está activo (disponible) */
    private boolean active;
}
