package com.microservices.cart.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * JPA Entity representing a user's shopping cart.
 * Tracks the items added by a user and timestamps for creation and modification.
 */
@Entity
@Table(name = "shopping_carts")
@Getter
@Setter
public class ShoppingCartEntity {

    /** The internal unique identifier of the shopping cart. */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /** The email of the user who owns this cart. Must be unique per user. */
    @NotNull
    @Column(nullable = false, unique = true)
    private String userEmail;

    /** The collection of items currently present in the shopping cart. */
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItemEntity> items = new ArrayList<>();

    /** Timestamp recording when the cart was initially created. */
    @Column(nullable = false)
    private LocalDateTime createdAt;

    /** Timestamp recording when the cart was last modified. */
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    /**
     * JPA lifecycle callback to automatically initialize timestamps before persisting.
     */
    @PrePersist
    void setCreatedAt(){
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * JPA lifecycle callback to automatically update the modification timestamp before updating.
     */
    @PreUpdate
    void setUpdatedAt(){
        this.updatedAt = LocalDateTime.now();
    }

}
