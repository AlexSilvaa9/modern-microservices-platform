package com.microservices.product.model;

import java.math.BigDecimal;
import java.util.UUID;

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
import org.hibernate.envers.Audited;

/**
 * JPA Entity representing a product in the catalog database.
 */
@Audited
@Entity
@Table(name = "product")
@Getter
@Setter
public class ProductEntity {

    /** The internal unique identifier of the product. */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /** The display name of the product. */
    @NotBlank(message = "Product name is required")
    @Column(nullable = false)
    private String name;

    /** A descriptive text about the product. */
    @Column(length = 1000)
    private String description;

    /** The monetary price of the product. */
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    /** The category string classifying the product. */
    private String category;
    
    /** The URL pointing to the product's image resource. */
    private String imageUrl;
    
    /** A flag indicating if the product is active and visible in the catalog. */
    private boolean active;


}
