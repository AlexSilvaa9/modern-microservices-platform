package com.microservices.core.dto;

import lombok.Builder;
import java.time.Instant;

@Builder
public class ApiResponse<T> {

    private String message;

    @Builder.Default
    private Instant timestamp = Instant.now();

    private T data;

    public ApiResponse(String message, T data) {

        this.message = message;
        this.timestamp = Instant.now();
        this.data = data;}

}

