package com.microservices.user.controller;

import com.microservices.core.common.dto.BaseApiResponse;
import com.microservices.core.common.dto.UserDTO;
import com.microservices.core.common.dto.enums.IdentityProvider;
import com.microservices.core.common.dto.enums.Role;
import com.microservices.user.dto.DataBaseRegistrationRequest;
import com.microservices.user.service.AuthService;

import com.microservices.user.dto.DataBaseLoginRequest;
import com.microservices.user.dto.AuthDTO;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

import org.jspecify.annotations.NullMarked;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.tags.Tag;


import java.util.Collections;

/**
 * REST controller managing authentication operations.
 * Handles user registration, login, logout, token refresh, and OAuth2 callbacks.
 */
@Slf4j
@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Endpoints para autenticación (login / register)")
@ConditionalOnProperty(name = "user-management.database.enable", havingValue = "true")
public class DatabaseAuthController {

    /** Service handling traditional username/password authentication and registration. */
    private final AuthService service;

    private static final String SAME_SITE_POLICY = "Strict";

    /**
     * Constructs a new AuthController with necessary dependencies.
     *
     * @param service             the standard authentication service
     */
    public DatabaseAuthController(AuthService service) {
        this.service = service;
    }

    private HttpHeaders buildAuthHeaders(String accessToken, String refreshToken, long maxAge) {

        ResponseCookie accessCookie = ResponseCookie.from("access_token", accessToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(maxAge)
                .sameSite(SAME_SITE_POLICY)
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(maxAge)
                .sameSite(SAME_SITE_POLICY)
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE, accessCookie.toString());
        headers.add(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return headers;
    }

    /**
     * Authenticates a user using credentials (email and password).
     * Returns the JWT tokens in HTTP-only cookies.
     *
     * @param req the login request containing credentials
     * @return a successful response containing the public user details
     */
    @PostMapping("/login")
    public ResponseEntity<BaseApiResponse<UserDTO>> login(@Valid @RequestBody DataBaseLoginRequest req) {

        AuthDTO resp = service.authenticate(req);

        BaseApiResponse<UserDTO> body =
                new BaseApiResponse<>("Login Successful", null);

        return ResponseEntity
                .status(HttpStatus.OK)
                .headers(buildAuthHeaders(resp.getToken(), resp.getRefreshToken().getToken(), 3000))
                .body(body);
    }


    /**
     * Registers a new user account in the system using database identity provider.
     *
     * @param req the registration request containing user details and password
     * @return a successful response containing the newly registered user's details
     */
    @PostMapping("/register")
    @NullMarked
    public ResponseEntity<BaseApiResponse<UserDTO>> register(
            @Valid @RequestBody DataBaseRegistrationRequest req) {

        UserDTO u = UserDTO.builder()
                .email(req.email())
                .username(req.username())
                .roles(Collections.singletonList(Role.USER))
                .build();

        UserDTO saved = service.register(u, req.password(), IdentityProvider.DATABASE);

        BaseApiResponse<UserDTO> body =
                new BaseApiResponse<>("User Registered Successfully", saved);

        return ResponseEntity.status(HttpStatus.OK).body(body);
    }

}