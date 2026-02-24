package com.microservices.user.controller;
import java.util.UUID;

import com.microservices.core.dto.ApiResponse;
import com.microservices.core.dto.UserDTO;
import com.microservices.core.exception.BadRequestException;
import com.microservices.user.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;

import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get User by ID")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "User fetched successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserDTO.class)
                    )
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "User not found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = {
                                    @ExampleObject(value = "{\"message\": \"User not found\", \"data\": null}")
                            }
                    )
            )
    })
    public ResponseEntity<ApiResponse<UserDTO>> getUser(
            @PathVariable
            @Parameter(description = "ID del usuario a consultar", required = true)
            String id,

            @RequestHeader("Authorization")
            @Parameter(
                    in = ParameterIn.HEADER,
                    description = "Token JWT Bearer",
                    required = true,
                    example = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            )
            String authHeader
    )  {
        var user = service.findById(UUID.fromString(id))
                .orElseThrow(() -> new BadRequestException("User not found"));

        ApiResponse<UserDTO> body = new ApiResponse<>("User fetched successfully", user);
        return ResponseEntity.ok(body);
    }
}
