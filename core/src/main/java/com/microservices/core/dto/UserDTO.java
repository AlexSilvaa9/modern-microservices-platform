package com.microservices.core.dto;

import com.microservices.core.dto.enums.IdentityProvider;
import com.microservices.core.dto.enums.Role;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;


/**
 * DTO que expone la información pública del usuario (sin password).
 */
@Data
@Builder
public class UserDTO {
    private UUID id;
    private String email;
    private String username;
    private List<Role> roles;
    private List<IdentityProvider> providers;

}
