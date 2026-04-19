package com.microservices.user.service;

import com.microservices.core.dto.UserDTO;
import com.microservices.core.dto.enums.IdentityProvider;
import com.microservices.core.exception.BadRequestException;
import com.microservices.core.exception.UserAlreadyExistsException;
import com.microservices.core.security.JwtService;
import com.microservices.user.dao.UserDAO;
import com.microservices.user.dto.DataBaseLoginRequest;
import com.microservices.user.dto.AuthDTO;
import com.microservices.user.mapper.UserMapper;
import com.microservices.user.model.RefreshToken;
import com.microservices.user.model.UserEntity;
import jakarta.validation.constraints.NotNull;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;

@Service
public class AuthService {
    private final UserDAO dao;
    private final UserMapper mapper;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserDAO dao, UserMapper mapper, JwtService jwtService, RefreshTokenService refreshTokenService) {
        this.dao = dao;
        this.mapper = mapper;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    public @NotNull UserDTO register(UserDTO userDto, IdentityProvider provider) {
        return register(userDto, null, provider);
    }

    public @NotNull UserDTO register(UserDTO userDto, String rawPassword, IdentityProvider provider) {

        if (dao.findByEmail(userDto.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("Email ya registrado");
        }
        UserEntity e = mapper.fromDTO(userDto);

        if (rawPassword != null) {
            e.setPasswordHash(passwordEncoder.encode(rawPassword));
        }

        e.setCreatedAt(LocalDateTime.now());
        e.setProviders(Collections.singletonList(provider));

        UserEntity saved = dao.save(e);

        return mapper.toDTO(saved);
    }

    public @NotNull AuthDTO authenticate(DataBaseLoginRequest request) {
        var user = dao.findByEmail(request.email())
                .filter(u ->
                        u.getProviders().contains(IdentityProvider.DATABASE) &&
                        passwordEncoder.matches(request.password(), u.getPasswordHash())
                )
                .orElseThrow(() -> new BadRequestException("Credenciales inválidas"));

        String token = jwtService.generateToken(user.getEmail(), user.getRoles());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getEmail());

        return AuthDTO.builder()
                .token(token)
                .refreshToken(refreshToken)
                .build();

    }
}
