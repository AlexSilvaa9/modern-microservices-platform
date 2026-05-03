package com.microservices.cart.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Getter
@Setter
public class CartItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID productId;

    private int quantity;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private ShoppingCartEntity cart;
}