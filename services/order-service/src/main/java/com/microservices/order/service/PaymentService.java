package com.microservices.order.service;

import com.microservices.order.dto.MockPaymentWebhook;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {
    /** Kafka producer template for triggering asynchronous emails. */
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final IdempotencyService idempotencyService;
    public PaymentService(KafkaTemplate<String, Object> kafkaTemplate, IdempotencyService idempotencyService) {
        this.kafkaTemplate = kafkaTemplate;
        this.idempotencyService = idempotencyService;
    }

    public void handleSuccess(MockPaymentWebhook mockPaymentWebhook){
        if(idempotencyService.checkAndSaveEvent(mockPaymentWebhook.uuid().toString(), "payment-success","stripe")){
            kafkaTemplate.send("success-payment-topic", mockPaymentWebhook);

        }
    }
}
