package com.microservices.user.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import com.microservices.core.dto.UserDTO;
import com.microservices.core.exception.BadRequestException;
import jakarta.validation.constraints.NotNull;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.microservices.user.dao.UserDAO;
import com.microservices.user.dto.AuthRequestDTO;
import com.microservices.user.dto.AuthResponseDTO;
import com.microservices.user.mapper.UserMapper;
import com.microservices.user.model.UserEntity;
import com.microservices.core.security.JwtUtil;

/**
 * Servicio de usuarios: registro, consulta y autenticación.
 */
@Service
@Transactional
public class UserService implements UserDetailsService {

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

    public @NotNull UserDTO register(UserDTO userDto, String rawPassword) {
        UserEntity e = mapper.fromDTO(userDto);
        e.setPasswordHash(passwordEncoder.encode(rawPassword));
        e.setCreatedAt(LocalDateTime.now());
        UserEntity saved = dao.save(e);
        return mapper.toDTO(saved);
    }

    public @NotNull AuthResponseDTO authenticate(AuthRequestDTO request) {
        var user = dao.findByEmail(request.email())
                .filter(u -> passwordEncoder.matches(request.password(), u.getPasswordHash()))
                .orElseThrow(() -> new BadRequestException("Credenciales inválidas"));

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        AuthResponseDTO r = new AuthResponseDTO();
        r.setToken(token);
        r.setUser(mapper.toDTO(user));
        return r;

    }
    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        return dao.findByEmail(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found: " + username)
                );
    }
}

