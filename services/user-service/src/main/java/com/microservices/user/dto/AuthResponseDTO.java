package com.microservices.user.dto;

import lombok.Data;

/**
 * DTO para respuesta de autenticación (JWT + usuario básico).
 */
@Data
public class AuthResponseDTO {
    private String token;
    private UserDTO user;

    public String getToken() { return this.token; }
    public void setToken(String token) { this.token = token; }
    public UserDTO getUser() { return this.user; }
    public void setUser(UserDTO user) { this.user = user; }
}
