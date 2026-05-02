package com.microservices.user.dto;

import com.microservices.user.model.RefreshToken;
import lombok.Builder;
import lombok.Data;

/**
 * DTO para respuesta de autenticación (JWT + refreshToken).
 */
@Data
@Builder
public class AuthDTO {
    private String token;
    private RefreshToken refreshToken;
}
