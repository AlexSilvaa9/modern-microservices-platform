package com.microservices.user.dto.seo;

import java.time.LocalDateTime;

public record UserEventDTO(
    String userId,
    String eventType,
    String path,
    LocalDateTime createdAt,
    String metadataJson
) {
}
