package com.microservices.cart.repository;

import org.jspecify.annotations.NullMarked;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

import com.microservices.cart.model.ShoppingCartEntity;

/**
 * JPA Repository for managing ShoppingCartEntity records.
 */
@Repository
@NullMarked
public interface ShoppingCartRepository extends JpaRepository<ShoppingCartEntity, UUID> {
    /**
     * Finds a shopping cart associated with the given user email.
     *
     * @param userEmail the email of the user owning the cart
     * @return an Optional containing the cart entity if it exists
     */
    Optional<ShoppingCartEntity> findByUserEmail(String userEmail);

}

