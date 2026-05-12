package com.microservices.order.order.dao;

import java.util.Optional;
import java.util.UUID;

import com.microservices.core.common.dto.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import com.microservices.order.order.model.OrderEntity;
import com.microservices.order.order.repository.OrderRepository;

/**
 * Data Access Object for handling Order database operations.
 * Abstracts the underlying JPA repository.
 */
@Component
public class OrderDao {

    /** Underlying JPA repository for orders. */
    private final OrderRepository repository;

    /**
     * Constructs a new OrderDao.
     *
     * @param repository the shopping cart JPA repository
     */
    public OrderDao(OrderRepository repository) {
        this.repository = repository;
    }

    public Optional<OrderEntity> findById(UUID uuid){
        return repository.findById(uuid);
    }

    /**
     * Persists or updates order entity.
     *
     * @param cart the cart to save
     * @return the saved cart entity
     */
    public OrderEntity save(OrderEntity cart) {
        return repository.save(cart);
    }

    /**
     * Retrieves orders by the owning user's email.
     *
     * @param userEmail the email of the user
     * @return an Optional containing the cart entity if found
     */
    public Page<OrderEntity> findByUserEmail(String userEmail, Pageable pageable) {
        return repository.findAllByUserEmail(userEmail, pageable);
    }

    public Page<OrderEntity> findByStatus(OrderStatus orderStatus, Pageable pageable) {
        return repository.findByStatus(orderStatus, pageable);
    }

}

