package com.microservices.core.security.jwt;

import lombok.EqualsAndHashCode;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

/**
 * Custom authentication token representing a JSON Web Token (JWT) based authentication request or result.
 * Extends AbstractAuthenticationToken to integrate smoothly with Spring Security.
 */
@EqualsAndHashCode(callSuper = false)
public class JwtAuthenticationToken extends AbstractAuthenticationToken {

    /**
     * The authenticated principal (typically the subject or user details).
     * Set to null before authentication.
     */
    private final transient Object principal;

    /**
     * The raw JWT token string. Used as the credentials.
     */
    private final String token;

    /**
     * Constructs an unauthenticated JwtAuthenticationToken.
     * Used initially when extracting the token from the incoming request.
     *
     * @param token the raw JWT token string
     */
    public JwtAuthenticationToken(String token) {
        super((Collection<? extends GrantedAuthority>) null);
        this.token = token;
        this.principal = null;
        setAuthenticated(false);
    }

    /**
     * Constructs an authenticated JwtAuthenticationToken.
     * Used after the token has been successfully verified and authorities granted.
     *
     * @param principal   the authenticated principal object
     * @param token       the raw JWT token string
     * @param authorities the granted authorities/roles extracted from the token
     */
    public JwtAuthenticationToken(Object principal,
                                  String token,
                                  Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.principal = principal;
        this.token = token;
        setAuthenticated(true);
    }

    /**
     * Retrieves the credentials for this authentication request.
     *
     * @return the JWT token string
     */
    @Override
    public Object getCredentials() {
        return token;
    }

    /**
     * Retrieves the authenticated principal.
     *
     * @return the principal object, or null if not yet authenticated
     */
    @Override
    public Object getPrincipal() {
        return principal;
    }
}