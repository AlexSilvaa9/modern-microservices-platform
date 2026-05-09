package com.microservices.user.dto;

import com.microservices.user.model.RefreshToken;
import lombok.Builder;
import lombok.Data;

/**
 * Data Transfer Object containing the access and refresh tokens returned upon successful authentication.
 */
@Data
@Builder
public class AuthDTO {
    /** The short-lived JWT access token used for immediate authentication. */
    private String token;
    /** The long-lived refresh token entity used to obtain new access tokens. */
    private RefreshToken refreshToken;
}
