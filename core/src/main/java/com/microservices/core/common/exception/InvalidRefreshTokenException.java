package com.microservices.core.common.exception;

/**
 * Custom exception thrown when a provided refresh token is expired, malformed, or otherwise invalid.
 * Typically mapped to an HTTP 401 Unauthorized or 403 Forbidden response.
 */
public class InvalidRefreshTokenException extends RuntimeException {

    /**
     * Constructs a new InvalidRefreshTokenException with the specified detail message.
     *
     * @param message the detail message explaining why the token is invalid
     */
    public InvalidRefreshTokenException(String message) {
        super(message);
    }
}
