package com.microservices.user.dto;

import lombok.Data;

/**
 * DTO para petición de autenticación.
 */
@Data
public class AuthRequestDTO {
    private String email;
    private String password;

    public String getEmail() { return this.email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return this.password; }
    public void setPassword(String password) { this.password = password; }
}
