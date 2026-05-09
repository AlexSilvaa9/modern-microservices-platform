package com.microservices.core.dto.order;

import java.math.BigDecimal;
import java.util.UUID;

public record ProductSnapshotDTO(

        UUID productId,

        String name,

        BigDecimal price,

        String imageUrl,

        String description
) {
}
