package com.microservices.catalog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
/**
 * Aplicación Spring Boot para el servicio de catálogo.
 * Habilita registro en servicio de descubrimiento y clientes Feign.
 */
@SpringBootApplication(
        scanBasePackages = {
                "com.microservices.core",
                "com.microservices.catalog"
        }
)
@EnableDiscoveryClient
@EnableFeignClients
public class CatalogServiceApplication {

    /**
     * Punto de entrada de la aplicación Spring Boot.
     *
     * @param args argumentos de la línea de comandos
     */
    public static void main(String[] args) {
        SpringApplication.run(CatalogServiceApplication.class, args);
    }

}
