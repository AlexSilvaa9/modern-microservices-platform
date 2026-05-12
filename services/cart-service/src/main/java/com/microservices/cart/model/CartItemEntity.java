package com.microservices.cart.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.envers.Audited;

import java.util.UUID;

/**
 * JPA Entity representing a single product line item within a shopping cart.
 */
@Entity
@Getter
@Setter
public class CartItemEntity {

    /** The internal unique identifier of the cart item. */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /** The unique identifier of the product added to the cart. */
    private UUID productId;

    /** The quantity of the product selected by the user. */
    private int quantity;

    /** The parent shopping cart that contains this item. */
    @ManyToOne
    @JoinColumn(name = "cart_id")
    private ShoppingCartEntity cart;
}