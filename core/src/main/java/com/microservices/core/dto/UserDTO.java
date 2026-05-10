package com.microservices.core.dto;

import com.microservices.core.dto.enums.IdentityProvider;
import com.microservices.core.dto.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;


/**
 * Data Transfer Object representing public user information.
 * Excludes sensitive data such as passwords or private system attributes.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    /**
     * The unique identifier of the user.
     */
    private UUID id;

    /**
     * The registered email address of the user.
     */
    private String email;

    /**
     * The display name or handle of the user.
     */
    private String username;

    /**
     * The list of security roles assigned to the user.
     */
    private List<Role> roles;

    /**
     * The list of identity providers (e.g., Google, Database) linked to this user.
     */
    private List<IdentityProvider> providers;

}
