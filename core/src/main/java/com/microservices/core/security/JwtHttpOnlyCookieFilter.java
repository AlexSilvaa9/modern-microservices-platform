package com.microservices.core.security;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

/**
 * Filtro que valida JWT en las peticiones y carga la autenticación en el contexto.
 */
@Slf4j
@Component
public class JwtHttpOnlyCookieFilter extends OncePerRequestFilter {

    private final SecurityProperties securityProperties;
    private final AuthenticationManager authenticationManager;
    public JwtHttpOnlyCookieFilter(SecurityProperties securityProperties, AuthenticationManager authenticationManager) {
        this.securityProperties = securityProperties;
        this.authenticationManager = authenticationManager;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        List<String> whiteList = Optional.ofNullable(securityProperties.getWhitelist())
                .orElse(List.of());

        String path = request.getServletPath();

        AntPathMatcher matcher = new AntPathMatcher();

        boolean isWhitelisted = whiteList.stream()
                .anyMatch(pattern -> matcher.match(pattern, path));

        if (isWhitelisted) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = extractTokenFromCookies(request);

        if (token != null){
            log.info("Jwt encontrado en la petición.");

        } else{
            log.info("Jwt no encontrado en la petición.");
        }
        if (token != null) {
            try {
                JwtAuthenticationToken authRequest = new JwtAuthenticationToken(token);

                Authentication authResult = authenticationManager.authenticate(authRequest);

                SecurityContextHolder.getContext().setAuthentication(authResult);

            } catch (AuthenticationException ex) {
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }

    private String extractTokenFromCookies(HttpServletRequest request) {

        if (request.getCookies() == null) return null;

        for (Cookie cookie : request.getCookies()) {
            if ("access_token".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        return null;
    }
}

