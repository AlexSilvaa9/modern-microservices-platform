package com.microservices.core.common.exception;

import com.microservices.core.common.dto.BaseApiResponse;
import org.jspecify.annotations.NullMarked;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;


import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Global exception handler for all REST controllers.
 * Intercepts specific exceptions thrown across the application and maps them
 * to standardized HTTP responses using {@link BaseApiResponse}.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles {@link NotFoundException} and returns a 404 Not Found response.
     *
     * @param ex      the intercepted exception containing the error message
     * @return a standardized response containing the error details
     */
    @NullMarked
    public ResponseEntity<BaseApiResponse< Object>> handleNotFound(NotFoundException ex) {
        HttpStatus status = HttpStatus.NOT_FOUND;

        BaseApiResponse<Object> body =
                new BaseApiResponse<>(
                        ex.getMessage() != null ? ex.getMessage() : "Resource not found"
                );

        return ResponseEntity.status(status).body(body);
    }

    /**
     * Handles {@link BadRequestException} and returns a 400 Bad Request response.
     *
     * @param ex      the intercepted exception containing the error message
     * @return a standardized response containing the error details
     */
    @NullMarked
    public ResponseEntity<BaseApiResponse<Object>> handleBadRequest(BadRequestException ex) {
        HttpStatus status = HttpStatus.BAD_REQUEST;

        BaseApiResponse<Object> body =
                new BaseApiResponse<>(
                        ex.getMessage() != null ? ex.getMessage() : "Invalid request"
                );

        return ResponseEntity.status(status).body(body);
    }

    /**
     * Handles generic {@link Exception} occurrences acting as a fallback handler,
     * returning a 500 Internal Server Error response.
     *
     * @param ex      the intercepted generic exception
     * @return a standardized response containing the unexpected error details
     */
    @NullMarked
    public ResponseEntity<BaseApiResponse<Object>> handleGeneral(Exception ex) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

        BaseApiResponse<Object> body =
                new BaseApiResponse<>(
                        ex.getMessage() != null ? ex.getMessage() : "Unexpected error occurred"
                );

        return ResponseEntity.status(status).body(body);
    }

    /**
     * Handles {@link MethodArgumentNotValidException} triggered by failed validation constraints
     * (e.g., @Valid annotations in request payloads) and returns a 400 Bad Request response.
     *
     * @param ex the exception containing the field-level validation errors
     * @return a standardized response mapping all field names to their respective validation messages
     */
    @NullMarked
    public ResponseEntity<BaseApiResponse<Object>> handleValidationErrors(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), Optional.ofNullable(error.getDefaultMessage()).orElse("ERROR.NO.CONTROLADO"))
        );

        BaseApiResponse<Object> body = new BaseApiResponse<>(errors.toString());

        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(DuplicatedEventException.class)
    public ResponseEntity<BaseApiResponse<Object>>
    handleDuplicateEvent(DuplicatedEventException ex) {

        BaseApiResponse<Object> body =
                new BaseApiResponse<>(ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(body);
    }
}

