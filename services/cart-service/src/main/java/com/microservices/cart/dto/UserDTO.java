package com.microservices.cart.dto;

import lombok.Data;

/**
 * DTO mínimo para consumir información del User Service.
 */
@Data
public class UserDTO {
    private String id;
    private String email;
    private boolean active;

}
