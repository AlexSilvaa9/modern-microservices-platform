package com.microservices.user.repository;


import com.microservices.user.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

/**
 * JPA Repository for managing RefreshToken entities.
 * Handles specialized token revocation operations.
 */
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    /**
     * Retrieves a refresh token record by its literal string value.
     *
     * @param token the string token
     * @return an Optional containing the token entity if found
     */
    Optional<RefreshToken> findByToken(String token);

    /**
     * Deletes all refresh tokens belonging to a specific user.
     *
     * @param userEmail the email of the user
     */
    void deleteByUserEmail(String userEmail);

    /**
     * Deletes a single refresh token by its internal UUID.
     *
     * @param id the UUID of the token
     */
    void deleteById(UUID id);

    /**
     * Invalidates a token by setting its valid flag to false.
     * Used mainly during logout processes to revoke access gracefully.
     *
     * @param token the literal token string to invalidate
     */
    @Modifying
    @Query("UPDATE RefreshToken r SET r.valid = false WHERE r.token = :token")
    void invalidRefreshTokenById(@Param("token") String token);
}