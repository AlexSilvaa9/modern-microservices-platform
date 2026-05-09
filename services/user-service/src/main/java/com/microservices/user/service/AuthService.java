package com.microservices.user.service;

import com.microservices.core.dto.UserDTO;
import com.microservices.core.dto.enums.IdentityProvider;
import com.microservices.core.exception.BadRequestException;
import com.microservices.core.exception.UserAlreadyExistsException;
import com.microservices.core.security.jwt.JwtService;
import com.microservices.user.dao.UserDAO;
import com.microservices.user.dto.DataBaseLoginRequest;
import com.microservices.user.dto.AuthDTO;
import com.microservices.user.mapper.UserMapper;
import com.microservices.user.model.RefreshToken;
import com.microservices.user.model.UserEntity;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotNull;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;

/**
 * Service orchestrating user registration and credential-based authentication.
 */
@Service
public class AuthService {
    /** Data access object for interacting with user persistence. */
    private final UserDAO dao;
    /** Mapper for converting between user entities and DTOs. */
    private final UserMapper mapper;
    /** Service for generating JSON Web Tokens. */
    private final JwtService jwtService;
    /** Service for managing refresh tokens. */
    private final RefreshTokenService refreshTokenService;
    /** Password encoder for hashing user passwords securely. */
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * Constructs a new AuthService.
     *
     * @param dao                 the user DAO
     * @param mapper              the user mapper
     * @param jwtService          the JWT generation service
     * @param refreshTokenService the refresh token lifecycle service
     */
    public AuthService(UserDAO dao, UserMapper mapper, JwtService jwtService, RefreshTokenService refreshTokenService) {
        this.dao = dao;
        this.mapper = mapper;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    /**
     * Registers a new user without a password (e.g., via OAuth2).
     *
     * @param userDto  the user details to register
     * @param provider the identity provider used
     * @return the saved user details
     */
    public @NotNull UserDTO register(UserDTO userDto, IdentityProvider provider) {
        return register(userDto, null, provider);
    }

    /**
     * Registers a new user with a password (e.g., via DATABASE provider).
     * Hashes the raw password before saving to the database.
     *
     * @param userDto     the user details to register
     * @param rawPassword the plain-text password chosen by the user
     * @param provider    the identity provider used
     * @return the saved user details
     * @throws UserAlreadyExistsException if the email is already in use
     */
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

    /**
     * Authenticates a user using email and password, returning new tokens.
     *
     * @param request the login payload containing email and password
     * @return an AuthDTO containing the new access and refresh tokens
     * @throws BadRequestException if credentials do not match or user lacks DATABASE provider
     */
    @Transactional
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
