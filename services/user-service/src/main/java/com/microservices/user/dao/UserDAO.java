package com.microservices.user.dao;

import java.util.Optional;
import java.util.UUID;

import com.microservices.core.dto.enums.IdentityProvider;
import com.microservices.core.exception.NotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import com.microservices.user.model.UserEntity;
import com.microservices.user.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Data Access Object abstracting JPA calls for UserEntity.
 * Centralizes transactional boundaries for database interactions.
 */
@Component
@Transactional
public class UserDAO {

    /** Underlying JPA repository for data persistence. */
    private final UserRepository repository;

    /**
     * Constructs a new UserDAO.
     *
     * @param repository the user JPA repository
     */
    public UserDAO(UserRepository repository) {
        this.repository = repository;
    }

    /**
     * Persists or updates a user entity in the database.
     *
     * @param user the entity to save
     * @return the saved entity
     */
    public UserEntity save(UserEntity user) { return repository.save(user); }
    /**
     * Finds a user entity by its UUID.
     *
     * @param id the UUID to query
     * @return an Optional containing the UserEntity if found
     */
    public Optional<UserEntity> findById(UUID id) { return repository.findById(id); }
    /**
     * Finds a user entity by its email.
     *
     * @param email the email to query
     * @return an Optional containing the UserEntity if found
     */
    public Optional<UserEntity> findByEmail(String email) { return repository.findByEmail(email); }
    /**
     * Fetches all registered users wrapped in a paginated result.
     *
     * @param pageable pagination and sorting parameters
     * @return a page containing the UserEntities
     */
    public Page<UserEntity> findAllUsers(Pageable pageable) { return repository.findAll(pageable); }
    /**
     * Appends an additional identity provider to an existing user's record.
     *
     * @param email    the user's email address
     * @param provider the identity provider to append (e.g., GOOGLE)
     * @return the updated user entity
     * @throws NotFoundException if the user is not found in the database
     */
    public UserEntity addProvider(String email, IdentityProvider provider) {

        UserEntity user = repository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (!user.getProviders().contains(provider)) {
            user.getProviders().add(provider);
        }

        return repository.save(user);
    }
}

