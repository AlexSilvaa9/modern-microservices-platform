package com.microservices.core.dto.enums;

/**
 * Enumeration representing the supported identity providers for user authentication.
 */
public enum IdentityProvider {
    /** Custom database credentials (username/password). */
    DATABASE,
    /** Google OAuth2 identity provider. */
    GOOGLE,
    /** Facebook OAuth2 identity provider. */
    FACEBOOK,
    /** GitHub OAuth2 identity provider. */
    GITHUB
}