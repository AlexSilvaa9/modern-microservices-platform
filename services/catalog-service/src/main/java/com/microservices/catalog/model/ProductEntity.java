package com.microservices.catalog.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

/**
 * Entidad JPA que representa la tabla "products" en la base de datos.
 */
@Getter
@Setter
@Entity
@Table(name = "products")
public class ProductEntity {

    /** Clave primaria autogenerada */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Nombre del producto (no nulo) */
    @NotBlank(message = "Product name is required")
    @Column(nullable = false)
    private String name;

    /** Descripción del producto */
    @Column(length = 1000)
    private String description;

    /** Precio (no nulo y positivo) */
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    /** Stock disponible (no nulo) */
    @NotNull(message = "Stock is required")
    @Column(nullable = false)
    private Integer stock;

    /** Categoría del producto */
    private String category;
    /** URL de la imagen */
    private String imageUrl;
    /** Indicador de producto activo */
    private boolean active;


}
