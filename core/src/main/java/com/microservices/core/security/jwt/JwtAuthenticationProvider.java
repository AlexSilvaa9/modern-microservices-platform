package com.microservices.core.security.jwt;

import io.jsonwebtoken.Claims;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class JwtAuthenticationProvider implements AuthenticationProvider {

    private final JwtService jwtService;

    public JwtAuthenticationProvider(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public Authentication authenticate(Authentication authentication) {

        String token = (String) authentication.getCredentials();

        Claims claims = jwtService.parseClaims(token);

        String subject = claims.getSubject();
        List<String> roles = claims.get("roles", List.class);

        List<SimpleGrantedAuthority> authorities = roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                .toList();

        return new JwtAuthenticationToken(
                subject,
                token,
                authorities
        );
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return JwtAuthenticationToken.class.isAssignableFrom(authentication);
    }
}