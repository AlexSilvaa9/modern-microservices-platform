package com.microservices.core.common.dto;

import java.time.Instant;


/**
 * Standardized API response envelope used across all REST controllers.
 * Wraps the actual data payload or error details along with a timestamp.
 *
 * @param <T>       the type of the payload data
 * @param errors    the error details, if any occurred during processing
 * @param message   a descriptive message regarding the response status
 * @param data      the actual payload returned by the endpoint
 * @param timestamp the exact time when this response was generated
 */
public record BaseApiResponse<T>(
        String errors,
        String message,
        T data,
        Instant timestamp
) {
    /**
     * Constructs a failure response containing only error details.
     * Timestamp is automatically generated.
     *
     * @param errors the error message or serialized error details
     */
    public BaseApiResponse(String errors) {
        this(errors, null, null, Instant.now());
    }

    /**
     * Constructs a successful response containing a message and data payload.
     * Timestamp is automatically generated.
     *
     * @param message a descriptive success message
     * @param data    the actual payload
     */
    public BaseApiResponse(String message, T data) {
        this(null, message, data, Instant.now());
    }

}
