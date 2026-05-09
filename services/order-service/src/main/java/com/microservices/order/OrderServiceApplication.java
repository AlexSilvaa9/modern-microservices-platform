package com.microservices.order;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * Main entry point for the Cart Service Spring Boot application.
 * Enables Feign clients for inter-service communication.
 */
@SpringBootApplication(
        scanBasePackages = {
                "com.microservices.core",
                "com.microservices.order"
        }
)
@EnableFeignClients
public class OrderServiceApplication {

    /**
     * The main method that launches the Spring Boot application.
     *
     * @param args command-line arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }

}
