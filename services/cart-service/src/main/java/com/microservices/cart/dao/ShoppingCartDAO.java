package com.microservices.cart.dao;

import java.util.Optional;

import org.springframework.stereotype.Component;

import com.microservices.cart.model.ShoppingCartEntity;
import com.microservices.cart.repository.ShoppingCartRepository;

/**
 * DAO que encapsula acceso a datos para carritos usando el repositorio.
 */
@Component
public class ShoppingCartDAO {

    private final ShoppingCartRepository repository;

    public ShoppingCartDAO(ShoppingCartRepository repository) {
        this.repository = repository;
    }

    public ShoppingCartEntity save(ShoppingCartEntity cart) {
        return repository.save(cart);
    }

    public Optional<ShoppingCartEntity> findByUserId(String userId) {
        return repository.findByUserId(userId);
    }
}

