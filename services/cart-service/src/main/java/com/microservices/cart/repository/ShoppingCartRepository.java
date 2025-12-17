package com.microservices.cart.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

import com.microservices.cart.model.ShoppingCartEntity;

/**
 * Repositorio Spring Data para la entidad ShoppingCartEntity.
 */
@Repository
public interface ShoppingCartRepository extends JpaRepository<ShoppingCartEntity, Long> {
    /**
     * Encuentra un carrito de compras por el ID del usuario.
     *
     * @param userId ID del usuario
     * @return Optional con el carrito si existe
     */
    Optional<ShoppingCartEntity> findByUserId(String userId);

}

