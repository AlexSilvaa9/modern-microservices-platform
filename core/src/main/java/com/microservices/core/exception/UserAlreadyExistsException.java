package com.microservices.core.exception;

/**
 * Custom exception thrown when attempting to register a user that already exists in the system.
 * Typically mapped to an HTTP 409 Conflict or 400 Bad Request response.
 */
public class UserAlreadyExistsException extends RuntimeException {

    /**
     * Constructs a new UserAlreadyExistsException with the specified detail message.
     *
     * @param message the detail message explaining the conflict
     */
    public UserAlreadyExistsException(String message) {
        super(message);
    }
}