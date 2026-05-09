package com.microservices.order.model;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Snapshot of a product at the time of purchase.
 * This entity is immutable and stored inside the Order service
 * to preserve historical accuracy even if the Product catalog changes.
 */
@Getter
@Setter
@Embeddable
public class ProductSnapshot {

    /**
     * Reference to the original product in the Product Service.
     */
    @Column(nullable = false)
    private UUID productId;

    /**
     * Product name at the time of purchase.
     */
    @Column(nullable = false)
    private String name;

    /**
     * Product price at the time of purchase.
     */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    /**
     * Image URL at the time of purchase.
     */
    private String imageUrl;

    /**
     * Optional short description snapshot (trimmed or simplified).
     */
    @Column(length = 500)
    private String description;
}