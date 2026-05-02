package com.microservices.core.security.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConfigurationProperties(prefix = "security")
@Data
public class SecurityProperties {

    private List<String> whitelist;
    private SecurityJwtProperties jwtProperties;
}