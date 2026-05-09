package com.microservices.user.controller;

import com.microservices.core.dto.BaseApiResponse;
import com.microservices.core.dto.UserDTO;
import com.microservices.core.dto.enums.IdentityProvider;
import com.microservices.core.dto.enums.Role;
import com.microservices.user.dto.DataBaseRegistrationRequest;
import com.microservices.user.model.RefreshToken;
import com.microservices.user.service.AuthService;
import com.microservices.user.service.GoogleAuthService;
import com.microservices.user.service.RefreshTokenService;
import com.microservices.user.dto.DataBaseLoginRequest;
import com.microservices.user.dto.AuthDTO;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

import org.jspecify.annotations.NullMarked;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.tags.Tag;


import java.io.IOException;
import java.util.Collections;
import java.util.Objects;

/**
 * REST controller managing authentication operations.
 * Handles user registration, login, logout, token refresh, and OAuth2 callbacks.
 */
@Slf4j
@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Endpoints para autenticación (login / register)")
public class AuthController {

    /** Service handling Google OAuth2 authentication. */
    private final GoogleAuthService googleAuthService;
    /** Service handling traditional username/password authentication and registration. */
    private final AuthService service;
    /** Service managing refresh tokens in the database. */
    private final RefreshTokenService refreshTokenService;
    private static final String SAME_SITE_POLICY = "Strict";

    /**
     * Constructs a new AuthController with necessary dependencies.
     *
     * @param googleAuthService   the Google authentication service
     * @param service             the standard authentication service
     * @param refreshTokenService the refresh token service
     */
    public AuthController(GoogleAuthService googleAuthService,
                          AuthService service,
                          RefreshTokenService refreshTokenService) {
        this.googleAuthService = googleAuthService;
        this.service = service;
        this.refreshTokenService = refreshTokenService;
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
     * Logs out the user by invalidating their refresh token and clearing authentication cookies.
     *
     * @param refreshToken the active refresh token from cookies
     * @return a successful logout confirmation
     */
    @PostMapping("/logout")
    public ResponseEntity<BaseApiResponse<Object>> logout(
            @CookieValue(name = "refresh_token", required = false) String refreshToken) {

        // 1. Invalidar refresh token en BD
        if (refreshToken != null) {
            refreshTokenService.invalidRefreshToken(refreshToken);
        }



        return ResponseEntity
                .status(HttpStatus.OK)
                .headers(buildAuthHeaders("","", 0))
                .body(new BaseApiResponse<>("Logout successful", null));
    }

    /**
     * Refreshes the user's access token using a valid refresh token.
     * Issues a new pair of access and refresh tokens.
     *
     * @param requestedToken the refresh token from cookies
     * @return a successful response with new tokens attached as cookies
     */
    @PostMapping("/refresh")
    public ResponseEntity<BaseApiResponse<Object>> refreshToken(
            @CookieValue(name = "refresh_token", required = false) String requestedToken) {

        RefreshToken refreshToken = refreshTokenService.findByToken(requestedToken);
        AuthDTO authDTO = refreshTokenService.refresh(refreshToken);

        BaseApiResponse<Object> body =
                new BaseApiResponse<>("Token refreshed", null);

        return ResponseEntity
                .status(HttpStatus.OK)
                .headers(buildAuthHeaders(authDTO.getToken(),
                        authDTO.getRefreshToken().getToken(),
                        3000))
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

    /**
     * Handles the Google OAuth2 authorization callback.
     * Exchanges the authorization code for tokens, fetches user info, and redirects to the frontend.
     *
     * @param code     the authorization code returned by Google
     * @param response the HTTP response to attach cookies and send redirect
     * @throws IOException if a redirection error occurs
     */
    @GetMapping("/google/callback")
    public void callback(@RequestParam("code") String code,
                         HttpServletResponse response) throws IOException {

        log.info("/google/callback entró");

        AuthDTO resp = googleAuthService.handleGoogleLogin(code);

        HttpHeaders headers = buildAuthHeaders(
                resp.getToken(),
                resp.getRefreshToken().getToken(),
                3000
        );

        response.addHeader(HttpHeaders.SET_COOKIE,
                headers.getFirst(HttpHeaders.SET_COOKIE));
        response.addHeader(HttpHeaders.SET_COOKIE,
                Objects.requireNonNull(headers.get(HttpHeaders.SET_COOKIE)).get(1));

        response.sendRedirect("http://localhost:4200/home");
    }
}