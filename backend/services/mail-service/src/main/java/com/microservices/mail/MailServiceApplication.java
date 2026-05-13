package com.microservices.mail;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Mail Service application.
 * Configures the Spring Boot application context and related beans.
 */
@SpringBootApplication(
        scanBasePackages = {
                "com.microservices.core.common",
                "com.microservices.mail"
        }
)
public class MailServiceApplication {

    /**
     * The main method that launches the Spring Boot application.
     *
     * @param args command-line arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(MailServiceApplication.class, args);
    }

}
