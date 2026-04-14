package com.microservices.core.exception;

import com.microservices.core.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Manejo global de excepciones para los controladores.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiResponse< Object>> handleNotFound(NotFoundException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.NOT_FOUND;

        ApiResponse<Object> body =
                new ApiResponse<> (
                        ex.getMessage() != null ? ex.getMessage() : "Resource not found",
                        null
                );

        return ResponseEntity.status(status).body(body);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse<Object>> handleBadRequest(BadRequestException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;

        ApiResponse<Object> body =
                new ApiResponse<> (
                        ex.getMessage() != null ? ex.getMessage() : "Invalid request",
                        null
                );

        return ResponseEntity.status(status).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGeneral(Exception ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

        ApiResponse<Object> body =
                new ApiResponse<> (
                        ex.getMessage() != null ? ex.getMessage() : "Unexpected error occurred",
                        null
                );

        return ResponseEntity.status(status).body(body);
    }
}

