package com.microservices.core.security.jwt;

import java.util.Date;
import java.nio.charset.StandardCharsets;
import java.util.List;

import com.microservices.core.dto.enums.Role;
import com.microservices.core.security.properties.SecurityProperties;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;


/**
 * Utility service for generating and validating JSON Web Tokens (JWT).
 * Uses HMAC SHA keys to sign tokens securely.
 */
@Component
public class JwtService {

    /**
     * The security properties containing JWT configuration details like secret and expiration.
     */
    private final SecurityProperties securityProperties;

    /**
     * Constructs a new JwtService with the given properties.
     *
     * @param securityProperties the application security properties
     */
    public JwtService(SecurityProperties securityProperties) {
        this.securityProperties = securityProperties;
    }

    /**
     * Retrieves the secret key used for signing and verifying tokens.
     *
     * @return the HMAC SHA SecretKey derived from the configuration secret
     */
    private SecretKey key() {
        return Keys.hmacShaKeyFor(securityProperties.getJwtProperties().getSecret().getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Generates a new JWT for the given subject and roles.
     *
     * @param subject the principal subject (usually the username or user ID)
     * @param roles   the list of roles assigned to the subject
     * @return the generated JWT as a signed string
     */
    public String generateToken(String subject, List<Role> roles) {
        Date now = new Date();
        return Jwts.builder()
                .subject(subject)
                .claim("roles", roles.stream().map(Role::name).toList())
                .issuedAt(now)
                .expiration(new Date(now.getTime() + securityProperties.getJwtProperties().getExpirationMs()))
                .signWith(key())
                .compact();
    }

    /**
     * Parses the given JWT string and retrieves its claims.
     * Validates the signature and checks for token expiration.
     *
     * @param token the signed JWT string
     * @return the parsed Claims object
     * @throws io.jsonwebtoken.JwtException if the token is invalid or expired
     */
    public Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

}
