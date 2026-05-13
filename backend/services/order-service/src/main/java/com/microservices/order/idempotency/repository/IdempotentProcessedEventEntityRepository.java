package com.microservices.order.idempotency.repository;


import com.microservices.order.idempotency.model.IdempotentProcessedEventEntity;
import org.jspecify.annotations.NullMarked;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

/**
 * JPA Repository for managing ShoppingCartEntity records.
 */
@Repository
@NullMarked
public interface IdempotentProcessedEventEntityRepository extends JpaRepository<IdempotentProcessedEventEntity, UUID> {

}

