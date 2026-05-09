package com.microservices.user.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.microservices.core.dto.enums.IdentityProvider;
import com.microservices.core.dto.enums.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


/**
 * JPA Entity representing a user in the system database.
 * Holds authentication credentials, roles, and status flags required by Spring Security.
 */
@Entity
@Getter
@Setter
@Table(name = "users")
public class UserEntity {

    /** Internal unique identifier for the user. */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /** Unique email address of the user. */
    @Column(nullable = false, unique = true)
    private String email;

    /** Unique display name or handle of the user. */
    @Column(nullable = false, unique = true)
    private String username;

    /** Hashed password, nullable for users authenticated via external providers (OAuth2). */
    @Column(nullable = true)
    private String passwordHash;

    /** List of granted security roles for the user. */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "user_role",
            joinColumns = @JoinColumn(name = "user_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private List<Role> roles;

    /** List of identity providers linked to this account (e.g., DATABASE, GOOGLE). */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "user_provider",
            joinColumns = @JoinColumn(name = "user_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "provider")
    private List<IdentityProvider> providers;

    /** Timestamp capturing when the user account was created. */
    @Column(nullable = false)
    private LocalDateTime createdAt;

    /** Flag indicating if the user's account has expired. */
    @Column(nullable = false)
    private boolean accountNonExpired = true;

    /** Flag indicating if the user's account is locked. */
    @Column(nullable = false)
    private boolean accountNonLocked = true;

    /** Flag indicating if the user's credentials (password) have expired. */
    @Column(nullable = false)
    private boolean credentialsNonExpired = true;

    /** Flag indicating if the user is enabled or disabled. */
    @Column(nullable = false)
    private boolean enabled = true;

}
