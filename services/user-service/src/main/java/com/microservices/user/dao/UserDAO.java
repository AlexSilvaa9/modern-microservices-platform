package com.microservices.user.dao;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.microservices.user.model.UserEntity;
import com.microservices.user.repository.UserRepository;

/**
 * DAO para acceso a datos de usuarios.
 */
@Component
public class UserDAO {

    private final UserRepository repository;

    public UserDAO(UserRepository repository) {
        this.repository = repository;
    }

    public UserEntity save(UserEntity user) { return repository.save(user); }
    public Optional<UserEntity> findById(UUID id) { return repository.findById(id); }
    public Optional<UserEntity> findByEmail(String email) { return repository.findByEmail(email); }
}

