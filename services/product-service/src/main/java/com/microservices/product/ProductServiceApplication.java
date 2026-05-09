package com.microservices.product;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
/**
 * Main entry point for the Product Service application.
 * Bootstraps the context, enables service discovery, and configures Feign clients.
 */
@SpringBootApplication(
        scanBasePackages = {
                "com.microservices.core",
                "com.microservices.product"
        }
)
@EnableDiscoveryClient
@EnableFeignClients
public class ProductServiceApplication {

    /**
     * The main method that launches the Spring Boot application.
     *
     * @param args command-line arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(ProductServiceApplication.class, args);
    }

}
