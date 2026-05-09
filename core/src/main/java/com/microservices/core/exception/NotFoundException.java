package com.microservices.core.exception;

/**
 * Custom exception thrown when a requested resource cannot be found in the system.
 * Typically mapped to an HTTP 404 Not Found response.
 */
public class NotFoundException extends RuntimeException {

    /**
     * Constructs a new NotFoundException with the specified detail message.
     *
     * @param message the detail message explaining why the resource was not found
     */
    public NotFoundException(String message) {
        super(message);
    }
}
