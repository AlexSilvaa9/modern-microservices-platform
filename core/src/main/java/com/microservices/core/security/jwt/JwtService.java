package com.microservices.core.security.jwt;

import java.security.Key;
import java.util.Date;
import java.nio.charset.StandardCharsets;
import java.util.List;

import com.microservices.core.dto.enums.Role;
import com.microservices.core.security.properties.SecurityProperties;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;


/**
 * Utilidad para generar y validar JWT.
 */
@Component
public class JwtService {

    private final SecurityProperties securityProperties;

    public JwtService(SecurityProperties securityProperties) {
        this.securityProperties = securityProperties;
    }

    private Key key() {
        return Keys.hmacShaKeyFor(securityProperties.getJwtProperties().getSecret().getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String subject, List<Role> roles) {
        Date now = new Date();
        return Jwts.builder()
                .setSubject(subject)
                .claim("roles", roles.stream().map(Role::name).toList())
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + securityProperties.getJwtProperties().getExpirationMs()))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims parseClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token).getBody();
    }

}
