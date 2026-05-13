package com.microservices.user.controller;

import com.microservices.user.service.GoogleAuthService;
import com.microservices.user.dto.AuthDTO;

import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.tags.Tag;


import java.io.IOException;
import java.util.Objects;

/**
 * REST controller managing authentication operations.
 * Handles user registration, login, logout, token refresh, and OAuth2 callbacks.
 */
@Slf4j
@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Endpoints para autenticación (login / register)")
@ConditionalOnProperty(name = "user-management.google.enable", havingValue = "true")
public class GoogleAuthController {

    /** Service handling Google OAuth2 authentication. */
    private final GoogleAuthService googleAuthService;

    private static final String SAME_SITE_POLICY = "Strict";

    /**
     * Constructs a new AuthController with necessary dependencies.
     *
     * @param googleAuthService   the Google authentication service
     */
    public GoogleAuthController(GoogleAuthService googleAuthService) {
        this.googleAuthService = googleAuthService;
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