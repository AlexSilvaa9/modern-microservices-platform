package com.microservices.core.security.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Configuration properties for application security settings.
 * Maps to the 'security' prefix in the application configuration.
 */
@Component
@ConfigurationProperties(prefix = "security")
@Data
public class SecurityProperties {

    /**
     * List of endpoints that are allowed to bypass authentication.
     */
    private List<String> whitelist;

    /**
     * Properties related to JWT configuration.
     */
    private SecurityJwtProperties jwtProperties;
}