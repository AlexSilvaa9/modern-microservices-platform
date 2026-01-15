package com.microservices.core.exception;

import com.microservices.core.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import jakarta.servlet.http.HttpServletRequest;
import java.util.NoSuchElementException;

/**
 * Manejo global de excepciones para los controladores.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ApiResponse<Object>> handleNotFound(NoSuchElementException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.NOT_FOUND;
        ApiResponse<Object> body = ApiResponse.builder()
                .message(ex.getMessage() != null ? ex.getMessage() : "Resource not found")
                .data(null)
                .build();
        return ResponseEntity.status(status).body(body);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleBadRequest(IllegalArgumentException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        ApiResponse<Object> body = ApiResponse.builder()
                .message(ex.getMessage() != null ? ex.getMessage() : "Invalid request")
                .data(null)
                .build();
        return ResponseEntity.status(status).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGeneral(Exception ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        ApiResponse<Object> body = ApiResponse.builder()
                .message(ex.getMessage() != null ? ex.getMessage() : "Unexpected error occurred")
                .data(null)
                .build();
        return ResponseEntity.status(status).body(body);
    }
}

