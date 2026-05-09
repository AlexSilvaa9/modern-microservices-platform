package com.microservices.order.repository;

import com.microservices.core.dto.enums.OrderStatus;
import org.jspecify.annotations.NullMarked;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.microservices.order.model.OrderEntity;

/**
 * JPA Repository for managing ShoppingCartEntity records.
 */
@Repository
@NullMarked
public interface OrderRepository extends JpaRepository<OrderEntity, UUID> {
    /**
     * Finds orders associated with the given user email.
     *
     * @param userEmail the email of the user owning the cart
     * @return an Optional containing the cart entity if it exists
     */
    Page<OrderEntity> findAllByUserEmail(String userEmail, Pageable pageable);

    Page<OrderEntity> findByStatus(OrderStatus status, Pageable pageable);

}

