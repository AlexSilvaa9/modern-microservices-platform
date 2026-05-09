package com.microservices.core.dto.order;

import com.microservices.core.dto.enums.OrderStatus;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record OrderDTO(

    UUID id,

    String userEmail,

    OrderStatus status,

    BigDecimal totalAmount,

    String paymentIntentId, // Stripe mock or real

    List<OrderItemDTO> items,

    LocalDateTime createdAt,

    LocalDateTime updatedAt


) {
}
