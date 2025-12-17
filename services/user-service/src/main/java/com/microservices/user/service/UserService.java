package com.microservices.user.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.microservices.user.dao.UserDAO;
import com.microservices.user.dto.AuthRequestDTO;
import com.microservices.user.dto.AuthResponseDTO;
import com.microservices.user.dto.UserDTO;
import com.microservices.user.mapper.UserMapper;
import com.microservices.user.model.UserEntity;
import com.microservices.user.security.JwtUtil;

/**
 * Servicio de usuarios: registro, consulta y autenticación.
 */
@Service
@Transactional
public class UserService {

    private final UserDAO dao;
    private final UserMapper mapper;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserDAO dao, UserMapper mapper, JwtUtil jwtUtil) {
        this.dao = dao;
        this.mapper = mapper;
        this.jwtUtil = jwtUtil;
    }

    public Optional<UserDTO> findById(UUID id) {
        return dao.findById(id).map(mapper::toDTO);
    }

    public Optional<UserDTO> findByEmail(String email) {
        return dao.findByEmail(email).map(mapper::toDTO);
    }

    public UserDTO register(UserDTO userDto, String rawPassword) {
        UserEntity e = mapper.fromDTO(userDto);
        e.setPasswordHash(passwordEncoder.encode(rawPassword));
        UserEntity saved = dao.save(e);
        return mapper.toDTO(saved);
    }

    public AuthResponseDTO authenticate(AuthRequestDTO request) {
        return dao.findByEmail(request.getEmail()).map(u -> {
            if (passwordEncoder.matches(request.getPassword(), u.getPasswordHash())) {
                String token = jwtUtil.generateToken(u.getId().toString(), u.getRole());
                AuthResponseDTO r = new AuthResponseDTO();
                r.setToken(token);
                r.setUser(mapper.toDTO(u));
                return r;
            }
            return null;
        }).orElse(null);
    }
}

