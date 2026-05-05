package com.microservices.mail;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(
        scanBasePackages = {
                "com.microservices.core",
                "com.microservices.mail"
        }
)
public class MailServiceApplication {

    /**
     * Punto de entrada de la aplicación Spring Boot.
     *
     * @param args argumentos de la línea de comandos
     */
    public static void main(String[] args) {
        SpringApplication.run(MailServiceApplication.class, args);
    }

}
