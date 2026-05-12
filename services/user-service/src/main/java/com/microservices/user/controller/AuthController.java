package com.microservices.user.controller;

import com.microservices.core.common.dto.BaseApiResponse;
import com.microservices.user.model.RefreshToken;

import com.microservices.user.service.RefreshTokenService;
import com.microservices.user.dto.AuthDTO;


import lombok.extern.slf4j.Slf4j;


import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * REST controller managing authentication operations.
 * Handles user registration, login, logout, token refresh, and OAuth2 callbacks.
 */
@Slf4j
@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Endpoints para autenticación (login / register)")
public class AuthController {

    /** Service managing refresh tokens in the database. */
    private final RefreshTokenService refreshTokenService;
    private static final String SAME_SITE_POLICY = "Strict";

    /**
     * Constructs a new AuthController with necessary dependencies.
     *
     * @param refreshTokenService the refresh token service
     */
    public AuthController(RefreshTokenService refreshTokenService) {
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

}