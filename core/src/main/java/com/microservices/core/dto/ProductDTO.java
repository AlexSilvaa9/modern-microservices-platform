package com.microservices.core.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * DTO que representa los datos expuestos de un producto en la API.
 */
@Data
public class ProductDTO {

    /** Identificador del producto */
    private UUID id;

    /** Nombre del producto */
    @NotBlank(message = "Product name is required")
    private String name;

    /** Descripción corta o larga del producto */
    private String description;

    /** Precio del producto */
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;

    /** Categoría del producto */
    private String category;

    /** URL de la imagen */
    private String imageUrl;

}
