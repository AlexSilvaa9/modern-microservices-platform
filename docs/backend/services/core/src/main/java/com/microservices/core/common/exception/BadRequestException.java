package com.microservices.core.common.exception;

/**
 * Custom exception thrown when the client sends an invalid or malformed request.
 * Typically mapped to an HTTP 400 Bad Request response.
 */
public class BadRequestException extends RuntimeException {

    /**
     * Constructs a new BadRequestException with the specified detail message.
     *
     * @param message the detail message explaining why the request is bad
     */
    public BadRequestException(String message) {
        super(message);
    }
}
