package com.microservices.user.service;

import java.util.Optional;
import java.util.UUID;

import com.microservices.core.dto.UserDTO;
import com.microservices.core.dto.enums.IdentityProvider;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.microservices.user.dao.UserDAO;
import com.microservices.user.mapper.UserMapper;
import com.microservices.core.security.JwtService;

/**
 * Servicio de usuarios de db.
 */
@Service
@Transactional
public class UserService {

    private final UserDAO dao;
    private final UserMapper mapper;

    public UserService(UserDAO dao, UserMapper mapper, JwtService jwtService) {
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
    public UserDTO addProvider(String email, IdentityProvider provider){
        return mapper.toDTO(dao.addProvider(email, provider));
    }

}


