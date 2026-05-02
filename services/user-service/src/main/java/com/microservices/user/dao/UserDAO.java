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
 * DAO para acceso a datos de usuarios.
 */
@Component
@Transactional
public class UserDAO {

    private final UserRepository repository;

    public UserDAO(UserRepository repository) {
        this.repository = repository;
    }

    public UserEntity save(UserEntity user) { return repository.save(user); }
    public Optional<UserEntity> findById(UUID id) { return repository.findById(id); }
    public Optional<UserEntity> findByEmail(String email) { return repository.findByEmail(email); }
    public Page<UserEntity> findAllUsers(Pageable pageable) { return repository.findAll(pageable); }
    public UserEntity addProvider(String email, IdentityProvider provider) {

        UserEntity user = repository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (!user.getProviders().contains(provider)) {
            user.getProviders().add(provider);
        }

        return repository.save(user);
    }
}

