package com.microservices.core.security.jwt;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.EqualsAndHashCode;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

@EqualsAndHashCode(callSuper = false)
public class JwtAuthenticationToken extends AbstractAuthenticationToken {

    private final transient Object principal;
    private final String token;

    // Constructor BEFORE authentication
    public JwtAuthenticationToken(String token) {
        super((Collection<? extends GrantedAuthority>) null);
        this.token = token;
        this.principal = null;
        setAuthenticated(false);
    }

    // Constructor AFTER authentication
    public JwtAuthenticationToken(Object principal,
                                  String token,
                                  Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.principal = principal;
        this.token = token;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return token;
    }

    @Override
    public Object getPrincipal() {
        return principal;
    }
}