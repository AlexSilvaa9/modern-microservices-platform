package com.microservices.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Data Transfer Object representing a new user registration request.
 *
 * @param email    the email address for the new user account
 * @param username the desired display name for the new user account
 * @param password the desired plain-text password for the new user account
 */
public record DataBaseRegistrationRequest(
        @NotBlank(message = "El email no puede estar vacío")
        @Email(message = "El email no tiene un formato válido")
        String email,

        @NotBlank(message = "El username no puede estar vacío")
        String username,

        @NotBlank(message = "La contraseña no puede estar vacía")
        @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
        String password
) {}
