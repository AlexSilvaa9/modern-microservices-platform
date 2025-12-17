package com.microservices.user.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.microservices.user.service.UserService;

/**
 * Inicializa usuarios por defecto en la base de datos para entornos locales.
 */
@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner init(UserService userService) {
        return args -> {
            // Crear admin si no existe
            if (userService.findByEmail("admin@example.com").isEmpty()) {
                com.microservices.user.dto.UserDTO adminDto = new com.microservices.user.dto.UserDTO();
                adminDto.setEmail("admin@example.com");
                adminDto.setRole("ROLE_ADMIN");
                userService.register(adminDto, "admin123");
            }
        };
    }
}
