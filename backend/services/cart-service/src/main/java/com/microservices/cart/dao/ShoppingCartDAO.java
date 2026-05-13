package com.microservices.cart.dao;

import java.util.Optional;

import org.springframework.stereotype.Component;

import com.microservices.cart.model.ShoppingCartEntity;
import com.microservices.cart.repository.ShoppingCartRepository;

/**
 * Data Access Object for handling ShoppingCart database operations.
 * Abstracts the underlying JPA repository.
 */
@Component
public class ShoppingCartDAO {

    /** Underlying JPA repository for shopping carts. */
    private final ShoppingCartRepository repository;

    /**
     * Constructs a new ShoppingCartDAO.
     *
     * @param repository the shopping cart JPA repository
     */
    public ShoppingCartDAO(ShoppingCartRepository repository) {
        this.repository = repository;
    }

    /**
     * Persists or updates a shopping cart entity.
     *
     * @param cart the cart to save
     * @return the saved cart entity
     */
    public ShoppingCartEntity save(ShoppingCartEntity cart) {
        return repository.save(cart);
    }

    /**
     * Retrieves a shopping cart by the owning user's email.
     *
     * @param userEmail the email of the user
     * @return an Optional containing the cart entity if found
     */
    public Optional<ShoppingCartEntity> findByUserEmail(String userEmail) {
        return repository.findByUserEmail(userEmail);
    }
}

