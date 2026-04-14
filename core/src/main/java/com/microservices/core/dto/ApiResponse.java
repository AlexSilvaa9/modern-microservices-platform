package com.microservices.core.dto;

import java.time.Instant;

public record ApiResponse<T>(
        String message,
        Instant timestamp,
        T data
) {
    public ApiResponse(String message, T data) {
        this(message, Instant.now(), data);
    }
}
