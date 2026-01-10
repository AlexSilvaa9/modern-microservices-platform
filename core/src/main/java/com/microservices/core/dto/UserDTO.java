package com.microservices.core.dto;

import com.microservices.core.dto.enums.Role;
import lombok.Data;

import java.util.UUID;


/**
 * DTO que expone la información pública del usuario (sin password).
 */
@Data
public class UserDTO {
    private UUID id;
    private String email;
    private String username;
    private Role role;

}
