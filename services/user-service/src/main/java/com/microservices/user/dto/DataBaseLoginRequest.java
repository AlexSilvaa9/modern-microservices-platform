package com.microservices.user.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Data Transfer Object representing a user login request with email and password credentials.
 *
 * @param email    the registered email address of the user
 * @param password the plain-text password provided for authentication
 */
public record DataBaseLoginRequest(

        @NotBlank(message = "El email no puede estar vacío")
        @Email(message = "El email no tiene un formato válido")
        String email,

        @NotBlank(message = "La contraseña no puede estar vacía")
        @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
        String password

) {}
