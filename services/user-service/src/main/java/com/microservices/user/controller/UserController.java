package com.microservices.user.controller;


import com.microservices.core.common.dto.BaseApiResponse;
import com.microservices.core.common.dto.UserDTO;

import com.microservices.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;


import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing user profiles and querying user records.
 * Provides endpoints for both authenticated users and administrators.
 */
@RestController
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT"
)
public class UserController {

    /** Service providing user data operations. */
    private final UserService service;

    /**
     * Constructs a new UserController with the specified user service.
     *
     * @param service the user service dependency
     */
    public UserController(UserService service) {
        this.service = service;
    }


    /**
     * Retrieves the profile information of the currently authenticated user.
     *
     * @param authentication the current security context authentication
     * @return a successful response containing the current user's profile details
     * @throws AccessDeniedException if the user is not authenticated
     * @throws UsernameNotFoundException if the authenticated user no longer exists
     */
    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Current user fetched successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserDTO.class)
                    )
            )
    })
    public ResponseEntity<BaseApiResponse<UserDTO>> me(Authentication authentication) {


        if (authentication == null || !authentication.isAuthenticated()){
            throw new AccessDeniedException("Not Signed In");
        }
        // principal = email
        String email = authentication.getName();

        var user = service.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        BaseApiResponse<UserDTO> body =
                new BaseApiResponse<>("Current user fetched successfully", user);

        return ResponseEntity.ok(body);
    }

    /**
     * Retrieves a paginated list of all registered users.
     * Requires the ADMIN role.
     *
     * @param pageable pagination and sorting parameters
     * @return a successful response containing a page of user profiles
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all users paginated")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Users fetched successfully"
            )
    })
    public ResponseEntity<BaseApiResponse<Page<UserDTO>>> users(Pageable pageable) {

        Page<UserDTO> users = service.findAll(pageable);

        BaseApiResponse<Page<UserDTO>> body =
                new BaseApiResponse<>("Users fetched successfully", users);

        return ResponseEntity.ok(body);
    }
}
