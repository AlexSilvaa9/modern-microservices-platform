package com.microservices.core.common.security.jwt;


import com.microservices.core.common.security.properties.SecurityProperties;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NullMarked;
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
 * OncePerRequestFilter implementation that extracts and validates JWT tokens from HTTP-only cookies.
 * Bypasses token validation for whitelisted paths.
 * If a valid token is found, it populates the SecurityContextHolder with the authentication details.
 */
@Slf4j
@Component
public class JwtHttpOnlyCookieFilter extends OncePerRequestFilter {

    /**
     * Security properties used to retrieve endpoint whitelists.
     */
    private final SecurityProperties securityProperties;

    /**
     * AuthenticationManager responsible for authenticating the extracted JWT.
     */
    private final AuthenticationManager authenticationManager;

    /**
     * Constructs a new JwtHttpOnlyCookieFilter.
     *
     * @param securityProperties    the security properties containing the whitelist
     * @param authenticationManager the authentication manager to process JWT tokens
     */
    public JwtHttpOnlyCookieFilter(SecurityProperties securityProperties, AuthenticationManager authenticationManager) {
        this.securityProperties = securityProperties;
        this.authenticationManager = authenticationManager;
    }

    /**
     * Executes the filter logic, bypassing whitelisted endpoints and attempting to authenticate incoming requests.
     *
     * @param request     the incoming HTTP request
     * @param response    the outgoing HTTP response
     * @param filterChain the next filters in the chain to execute
     * @throws ServletException if a servlet error occurs
     * @throws IOException      if an I/O error occurs
     */
    @Override
    @NullMarked
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

    /**
     * Extracts the access token from the request cookies.
     *
     * @param request the HTTP request containing cookies
     * @return the token string if the "access_token" cookie is found; null otherwise
     */
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

