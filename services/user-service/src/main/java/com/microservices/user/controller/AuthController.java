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

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.tags.Tag;


import java.io.IOException;
import java.util.Collections;
import java.util.Objects;

@Slf4j
@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Endpoints para autenticación (login / register)")
public class AuthController {

    private final GoogleAuthService googleAuthService;
    private final AuthService service;
    private final RefreshTokenService refreshTokenService;
    private static final String SAME_SITE_STRICT = "Strict";
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
                .sameSite(SAME_SITE_STRICT)
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(maxAge)
                .sameSite(SAME_SITE_STRICT)
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE, accessCookie.toString());
        headers.add(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return headers;
    }

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


    @PostMapping("/register")
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

        response.sendRedirect("http://localhost:4200/");
    }
}