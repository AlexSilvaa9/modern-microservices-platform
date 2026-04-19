package com.microservices.core.dto;

import java.time.Instant;


public record BaseApiResponse<T>(
        String errors,
        String message,
        T data,
        Instant timestamp
) {
    public BaseApiResponse(String errors) {
        this(errors, null, null, Instant.now());
    }
    public BaseApiResponse(String message, T data) {
        this(null, message, data, Instant.now());
    }

}
