package com.microservices.user.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Data;

/**
 * DTO que expone la información pública del usuario (sin password).
 */
@Data
public class UserDTO {
    private UUID id;
    private String email;
    private String role;
    private LocalDateTime createdAt;

    // Accesores explícitos para análisis estático / IDEs sin Lombok
    public UUID getId() { return this.id; }
    public void setId(UUID id) { this.id = id; }
    public String getEmail() { return this.email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return this.role; }
    public void setRole(String role) { this.role = role; }
    public LocalDateTime getCreatedAt() { return this.createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
