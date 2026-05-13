package com.microservices.user.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

/**
 * JPA Entity representing a refresh token used to acquire new access tokens
 * without re-authenticating the user.
 */
@Entity
@Table(name = "refresh_tokens")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshToken {

    /** Internal database identifier for the token record. */
    @Id
    @GeneratedValue
    private UUID id;

    /** The actual secure random string value of the token. */
    @Column(nullable = false, unique = true, length = 512)
    private String token;

    /** The email of the user this token belongs to. */
    @Column(nullable = false)
    private String userEmail;

    /** The timestamp when this token becomes invalid. */
    @Column(nullable = false)
    private Instant expiryDate;

    /** Flag indicating whether the token has been revoked or is still active. */
    @Column
    private boolean valid;
}