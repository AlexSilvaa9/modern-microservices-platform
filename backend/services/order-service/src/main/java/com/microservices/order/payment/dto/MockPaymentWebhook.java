package com.microservices.order.payment.dto;

import java.util.UUID;

public record MockPaymentWebhook(
        UUID uuid
) {
}
