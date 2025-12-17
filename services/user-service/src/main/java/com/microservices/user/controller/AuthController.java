package com.microservices.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.microservices.user.dto.AuthRequestDTO;
import com.microservices.user.dto.AuthResponseDTO;
import com.microservices.user.service.UserService;

/**
 * Controlador de autenticación (login / register).
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService service;

    public AuthController(UserService service) { this.service = service; }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody AuthRequestDTO req) {
        AuthResponseDTO resp = service.authenticate(req);
        if (resp == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(resp);
    }

}

