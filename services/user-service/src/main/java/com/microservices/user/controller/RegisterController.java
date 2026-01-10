package com.microservices.user.controller;

import com.microservices.core.dto.UserDTO;
import com.microservices.core.dto.enums.Role;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.microservices.user.dto.AuthRequestDTO;
import com.microservices.user.service.UserService;

/**
 * Controlador para registro de nuevos usuarios.
 */
@RestController
@RequestMapping("/auth")
public class RegisterController {

    private final UserService service;

    public RegisterController(UserService service) { this.service = service; }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody AuthRequestDTO req) {
        UserDTO u = new UserDTO();
        u.setEmail(req.getEmail());
        u.setUsername(req.getUsername());
        u.setRole(Role.valueOf(req.getRole()));
        UserDTO saved = service.register(u, req.getPassword());
        return ResponseEntity.ok(saved);
    }
}

