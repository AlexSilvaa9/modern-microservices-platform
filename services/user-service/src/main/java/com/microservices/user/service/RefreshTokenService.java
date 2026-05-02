package com.microservices.user.service;


import com.microservices.core.dto.UserDTO;
import com.microservices.core.exception.InvalidRefreshTokenException;
import com.microservices.core.security.jwt.JwtService;
import com.microservices.user.dto.AuthDTO;
import com.microservices.user.model.RefreshToken;
import com.microservices.user.repository.RefreshTokenRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@Transactional
public class RefreshTokenService {

    private final RefreshTokenRepository repository;
    private final JwtService jwtService;
    private final UserService userService;
    private static final long REFRESH_TOKEN_DURATION_MS = 7 * 24 * 60 * 60 * 1000L;

    public RefreshTokenService(RefreshTokenRepository repository, JwtService jwtService, UserService userService) {
        this.repository = repository;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    public RefreshToken createRefreshToken(String email) {

        RefreshToken token = RefreshToken.builder()
                .userEmail(email)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(REFRESH_TOKEN_DURATION_MS))
                .valid(true)
                .build();

        return repository.save(token);
    }

    @Transactional
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (!token.isValid() || token.getExpiryDate().isBefore(Instant.now())) {
            repository.delete(token);
            throw new InvalidRefreshTokenException("Refresh token expired");
        }
        return token;
    }

    public RefreshToken findByToken(String token) {
        return repository.findByToken(token)
                .orElseThrow(() -> new InvalidRefreshTokenException("Refresh token not found"));
    }

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
    @Transactional
    public void deleteByUserEmail(String email) {
        repository.deleteByUserEmail(email);
    }

    @Transactional
    public void deleteById(UUID id){
        repository.deleteById(id);
    }
    @Transactional
    public void invalidRefreshToken(String token){
        repository.invalidRefreshTokenById(token);
    }
}