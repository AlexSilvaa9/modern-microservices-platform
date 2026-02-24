package com.microservices.user.controller;

import com.microservices.core.dto.ApiResponse;
import com.microservices.core.dto.UserDTO;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.microservices.user.dto.AuthRequestDTO;
import com.microservices.user.dto.AuthResponseDTO;
import com.microservices.user.service.UserService;

import jakarta.validation.Valid;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

/**
 * Controlador de autenticación (login / register).
 */
@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Endpoints para autenticación (login / register)")
public class AuthController {

    private final UserService service;

    public AuthController(UserService service) { this.service = service; }

    @PostMapping("/login")
    @Operation(summary = "Login user")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Login successful",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = AuthResponseDTO.class)
                    )
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid credentials",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = {@ExampleObject(value = "{\"message\": \"Credenciales inválidas\", \"data\": null}")}
                    )
            )
    })
    public ResponseEntity<ApiResponse<AuthResponseDTO>> login(@Valid @RequestBody AuthRequestDTO req) {

        AuthResponseDTO resp = service.authenticate(req);

        ApiResponse<AuthResponseDTO> body = new ApiResponse<>("Login Successful", resp);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(body);
    }


    @PostMapping("/register")
    @Operation(summary = "Register", description = "Registra un usuario y devuelve el usuario básico.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Register successful",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = UserDTO.class)
                    ))
    })
    public ResponseEntity<ApiResponse<UserDTO>> register(@RequestBody AuthRequestDTO req) {

        UserDTO u = new UserDTO();
        u.setEmail(req.email());
        u.setUsername(req.username());
        u.setRole(req.role());

        UserDTO saved = service.register(u, req.password());

        ApiResponse<UserDTO> body = new ApiResponse<>("User Registered Successfully", saved);

        return ResponseEntity.status(HttpStatus.OK).body(body);
    }

}
