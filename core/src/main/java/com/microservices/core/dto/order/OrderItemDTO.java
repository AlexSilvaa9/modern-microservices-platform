package com.microservices.core.dto.order;


import java.util.UUID;

public record OrderItemDTO(
        UUID id,

        ProductSnapshotDTO productSnapshotEntity,

        Integer quantity
) {
}
