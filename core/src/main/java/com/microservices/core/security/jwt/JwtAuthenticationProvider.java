package com.microservices.core.security.jwt;

import com.microservices.core.dto.enums.Role;
import io.jsonwebtoken.Claims;

import org.jspecify.annotations.NullMarked;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * AuthenticationProvider responsible for validating JwtAuthenticationToken instances.
 * Extracts claims from the JWT using JwtService and creates an authenticated token.
 */
@Component
public class JwtAuthenticationProvider implements AuthenticationProvider {

    /**
     * Service used for parsing and validating the JWT token.
     */
    private final JwtService jwtService;

    /**
     * Constructs a new JwtAuthenticationProvider with the specified service.
     *
     * @param jwtService the service to handle JWT operations
     */
    public JwtAuthenticationProvider(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    /**
     * Authenticates the provided authentication object if it is a JWT token.
     * Parses the claims and creates an authenticated token with the assigned roles.
     *
     * @param authentication the unauthenticated JwtAuthenticationToken
     * @return a fully authenticated JwtAuthenticationToken
     * @throws org.springframework.security.core.AuthenticationException if parsing fails or token is invalid
     */
    @Override
    public Authentication authenticate(Authentication authentication) {

        String token = (String) authentication.getCredentials();

        Claims claims = jwtService.parseClaims(token);

        String subject = claims.getSubject();

        Object rolesObj = claims.get("roles");

        List<Role> roles = new ArrayList<>();

        if (rolesObj instanceof List<?> list) {
            for (Object item : list) {
                if (item instanceof Role role) {
                    roles.add(role);
                }
            }
        }
        List<SimpleGrantedAuthority> authorities = roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toString()))
                .toList();

        return new JwtAuthenticationToken(
                subject,
                token,
                authorities
        );
    }

    /**
     * Verifies whether this provider supports the given authentication class.
     *
     * @param authentication the authentication class type
     * @return true if the authentication is assignable from JwtAuthenticationToken, false otherwise
     */
    @Override
    @NullMarked
    public boolean  supports(Class<?> authentication) {
        return JwtAuthenticationToken.class.isAssignableFrom(authentication);
    }
}