package com.microservices.user.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.microservices.user.model.UserEntity;

/**
 * JPA Repository for managing UserEntity records.
 * Provides standard CRUD operations and custom queries for user details.
 */
@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    /**
     * Retrieves a user entity based on its registered email.
     *
     * @param email the email to query
     * @return an Optional containing the UserEntity if a match is found
     */
    Optional<UserEntity> findByEmail(String email);
}

