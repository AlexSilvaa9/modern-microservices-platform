package com.microservices.core.exception;

import com.microservices.core.dto.BaseApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.Map;

/**
 * Manejo global de excepciones para los controladores.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<BaseApiResponse< Object>> handleNotFound(NotFoundException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.NOT_FOUND;

        BaseApiResponse<Object> body =
                new BaseApiResponse<>(
                        ex.getMessage() != null ? ex.getMessage() : "Resource not found"
                );

        return ResponseEntity.status(status).body(body);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<BaseApiResponse<Object>> handleBadRequest(BadRequestException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;

        BaseApiResponse<Object> body =
                new BaseApiResponse<>(
                        ex.getMessage() != null ? ex.getMessage() : "Invalid request"
                );

        return ResponseEntity.status(status).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<BaseApiResponse<Object>> handleGeneral(Exception ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

        BaseApiResponse<Object> body =
                new BaseApiResponse<>(
                        ex.getMessage() != null ? ex.getMessage() : "Unexpected error occurred"
                );

        return ResponseEntity.status(status).body(body);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<BaseApiResponse<Object>> handleValidationErrors(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );

        BaseApiResponse<Object> body = new BaseApiResponse<>(errors.toString());

        return ResponseEntity.badRequest().body(body);
    }
}

