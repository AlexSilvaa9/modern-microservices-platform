package com.microservices.user.service;

import java.util.Optional;
import java.util.UUID;

import com.microservices.core.dto.UserDTO;
import com.microservices.core.dto.enums.IdentityProvider;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.microservices.user.dao.UserDAO;
import com.microservices.user.mapper.UserMapper;

/**
 * Servicio de usuarios de db.
 */
@Service
public class UserService {

    private final UserDAO dao;
    private final UserMapper mapper;

    public UserService(UserDAO dao, UserMapper mapper) {
        this.dao = dao;
        this.mapper = mapper;
    }

    public Optional<UserDTO> findById(UUID id) {
        return dao.findById(id).map(mapper::toDTO);
    }

    public Optional<UserDTO> findByEmail(String email) {
        return dao.findByEmail(email).map(mapper::toDTO);
    }
    public Page<UserDTO> findAll(Pageable pageable) {
        return dao.findAllUsers(pageable)
                .map(mapper::toDTO);
    }
    @Transactional
    public UserDTO addProvider(String email, IdentityProvider provider){
        return mapper.toDTO(dao.addProvider(email, provider));
    }

}


