package com.microservices.user.repository;


import com.microservices.user.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    Optional<RefreshToken> findByToken(String token);

    void deleteByUserEmail(String userEmail);

    void deleteById(UUID id);

    @Modifying
    @Query("UPDATE RefreshToken r SET r.valid = false WHERE r.token = :token")
    void invalidRefreshTokenById(@Param("token") String token);
}