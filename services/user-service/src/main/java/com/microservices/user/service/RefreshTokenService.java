package com.microservices.user.service;


import com.microservices.core.common.dto.UserDTO;
import com.microservices.core.common.exception.InvalidRefreshTokenException;
import com.microservices.core.common.security.jwt.JwtService;
import com.microservices.user.dto.AuthDTO;
import com.microservices.user.model.RefreshToken;
import com.microservices.user.repository.RefreshTokenRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

/**
 * Service managing the lifecycle of refresh tokens.
 * Handles token generation, validation, expiration, and revocation.
 */
@Service
@Transactional
public class RefreshTokenService {

    /** Repository for accessing token database records. */
    private final RefreshTokenRepository repository;
    /** Service used to generate paired access tokens on refresh. */
    private final JwtService jwtService;
    /** Service used to fetch user details during a token refresh. */
    private final UserService userService;
    /** Duration in milliseconds for which a refresh token remains valid (7 days). */
    private static final long REFRESH_TOKEN_DURATION_MS = 7 * 24 * 60 * 60 * 1000L;

    /**
     * Constructs a new RefreshTokenService.
     *
     * @param repository  the token repository
     * @param jwtService  the internal JWT service
     * @param userService the user service
     */
    public RefreshTokenService(RefreshTokenRepository repository, JwtService jwtService, UserService userService) {
        this.repository = repository;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    /**
     * Creates and saves a new refresh token for the specified user email.
     *
     * @param email the user's email address
     * @return the newly generated RefreshToken entity
     */
    public RefreshToken createRefreshToken(String email) {

        RefreshToken token = RefreshToken.builder()
                .userEmail(email)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(REFRESH_TOKEN_DURATION_MS))
                .valid(true)
                .build();

        return repository.save(token);
    }

    /**
     * Validates if a token is still active and has not expired.
     * Deletes the token from the database if it is found to be expired.
     *
     * @param token the token entity to check
     * @throws InvalidRefreshTokenException if the token is invalid or expired
     */
    @Transactional
    public void verifyExpiration(RefreshToken token) {
        if (!token.isValid() || token.getExpiryDate().isBefore(Instant.now())) {
            repository.delete(token);
            throw new InvalidRefreshTokenException("Refresh token expired");
        }
    }

    /**
     * Retrieves a refresh token from the database by its token string.
     *
     * @param token the literal token string
     * @return the found token entity
     * @throws InvalidRefreshTokenException if the token does not exist
     */
    public RefreshToken findByToken(String token) {
        return repository.findByToken(token)
                .orElseThrow(() -> new InvalidRefreshTokenException("Refresh token not found"));
    }

    /**
     * Consumes a valid refresh token to generate a new pair of access and refresh tokens.
     * The old refresh token is subsequently deleted.
     *
     * @param refreshToken the valid token entity to consume
     * @return an AuthDTO containing the new tokens
     * @throws UsernameNotFoundException if the user linked to the token no longer exists
     */
    public AuthDTO refresh(RefreshToken refreshToken) {

        verifyExpiration(refreshToken);

        // eliminamos el refreshToken anterior
        deleteById(refreshToken.getId());

        UserDTO user = userService.findByEmail(refreshToken.getUserEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        return AuthDTO.builder()
                .refreshToken(createRefreshToken(user.getEmail()))
                .token(jwtService.generateToken(user.getEmail(), user.getRoles()))
                .build();
    }

    /**
     * Deletes all refresh tokens associated with a given user's email.
     *
     * @param email the user's email address
     */
    @Transactional
    public void deleteByUserEmail(String email) {
        repository.deleteByUserEmail(email);
    }


    /**
     * Deletes a specific refresh token by its primary identifier.
     *
     * @param id the internal UUID of the token
     */
    @Transactional
    public void deleteById(UUID id){
        repository.deleteById(id);
    }
    /**
     * Invalidates a specific refresh token, marking it as unusable without deleting the record.
     *
     * @param token the literal token string to invalidate
     */
    @Transactional
    public void invalidRefreshToken(String token){
        repository.invalidRefreshTokenById(token);
    }
}