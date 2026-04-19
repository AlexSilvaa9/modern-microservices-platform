package com.microservices.user.service;


import com.microservices.core.dto.UserDTO;
import com.microservices.core.security.JwtService;
import com.microservices.user.dto.AuthDTO;
import com.microservices.user.model.RefreshToken;
import com.microservices.user.repository.RefreshTokenRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository repository;
    private final JwtService jwtService;
    private final UserService userService;
    private final long refreshTokenDurationMs = 7 * 24 * 60 * 60 * 1000L;

    public RefreshTokenService(RefreshTokenRepository repository, JwtService jwtService, UserService userService) {
        this.repository = repository;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    public RefreshToken createRefreshToken(String email) {

        RefreshToken token = RefreshToken.builder()
                .userEmail(email)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshTokenDurationMs))
                .build();

        return repository.save(token);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(Instant.now())) {
            repository.delete(token);
            throw new RuntimeException("Refresh token expired");
        }
        return token;
    }

    public RefreshToken findByToken(String token) {
        return repository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));
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
    public void deleteByUserEmail(String email) {
        repository.deleteByUserEmail(email);
    }
    public void deleteById(UUID id){
        repository.deleteById(id);
    }
}