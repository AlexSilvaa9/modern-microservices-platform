package com.microservices.user.dto.seo;

public record PageVisitsDTO(
        String path,
        long visits
) {}