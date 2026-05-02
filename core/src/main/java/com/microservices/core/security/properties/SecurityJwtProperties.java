package com.microservices.core.security.properties;

import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Data
public class SecurityJwtProperties {
    private String secret;
    private long expirationMs;
}
