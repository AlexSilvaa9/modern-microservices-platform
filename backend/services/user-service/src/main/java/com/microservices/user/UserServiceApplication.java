package com.microservices.user;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.context.annotation.ComponentScan;

/**
 * Main entry point for the User Service Spring Boot application.
 * Bootstraps the application context and starts the embedded web server.
 */
@SpringBootApplication
@ComponentScan(
        basePackages = {
                "com.microservices.user",
                "com.microservices.core"
        }
)
@EntityScan(basePackages = {
        "com.microservices.user",
        "com.microservices.core"
})
public class UserServiceApplication {
    /**
     * The main method that launches the Spring Boot application.
     *
     * @param args command-line arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}

