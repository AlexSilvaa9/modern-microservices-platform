package com.microservices.order.payment.service;

import com.microservices.order.idempotency.aop.Idempotency;
import com.microservices.order.payment.dto.MockPaymentWebhook;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {
    /** Kafka producer template for triggering asynchronous emails. */
    private final KafkaTemplate<String, Object> kafkaTemplate;
    public PaymentService(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @Idempotency(key = "#mockPaymentWebhook.uuid")
    public void handleSuccess(MockPaymentWebhook mockPaymentWebhook){
        kafkaTemplate.send("success-payment-topic", mockPaymentWebhook);

    }
}
