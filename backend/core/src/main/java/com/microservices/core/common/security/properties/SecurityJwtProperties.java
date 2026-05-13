package com.microservices.core.common.security.properties;

import lombok.Data;
import org.springframework.stereotype.Component;

/**
 * Configuration properties for JWT (JSON Web Token) settings.
 */
@Component
@Data
public class SecurityJwtProperties {
    /**
     * The secret key used to sign and verify JWT tokens.
     */
    private String secret;

    /**
     * The expiration time of the JWT token in milliseconds.
     */
    private long expirationMs;
}
