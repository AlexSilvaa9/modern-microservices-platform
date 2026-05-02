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
 * Entidad JPA que representa un usuario.
 */
@Entity
@Getter
@Setter
@Table(name = "users")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = true)
    private String passwordHash;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "user_role",
            joinColumns = @JoinColumn(name = "user_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private List<Role> roles;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "user_provider",
            joinColumns = @JoinColumn(name = "user_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "provider")
    private List<IdentityProvider> providers;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    /** De UserDetails **/
    @Column(nullable = false)
    private boolean accountNonExpired = true;

    @Column(nullable = false)
    private boolean accountNonLocked = true;

    @Column(nullable = false)
    private boolean credentialsNonExpired = true;

    @Column(nullable = false)
    private boolean enabled = true;

}
