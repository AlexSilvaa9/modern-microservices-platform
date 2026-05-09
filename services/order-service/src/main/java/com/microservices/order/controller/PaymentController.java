package com.microservices.order.controller;

import com.microservices.order.dto.MockPaymentWebhook;
import com.microservices.order.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController("payment")
public class PaymentController {
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("webhook/mock")
    public ResponseEntity<Void> handleWebhook(
            @RequestBody MockPaymentWebhook mockPaymentWebhook
            ){
        paymentService.handleSuccess(mockPaymentWebhook);
        return ResponseEntity.ok().build();
    }
}
