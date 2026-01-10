package com.microservices.user.dto;

import lombok.Data;

/**
 * DTO para petición de autenticación.
 */
@Data
public class AuthRequestDTO {
    private String email;
    private String username;
    private String password;
    private String role;
}
