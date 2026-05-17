package com.microservices.core.common.dto.order;


import java.util.UUID;

public record OrderItemDTO(
        UUID id,

        ProductSnapshotDTO productSnapshotEntity,

        Integer quantity
) {
}
