package com.microservices.mail.service;

import com.microservices.core.common.dto.UserDTO;
import com.microservices.core.common.dto.order.OrderDTO;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Kafka listener service that consumes mail batch requests.
 * Processes asynchronous email dispatch via message brokering.
 */
@Service
public class KafkaMailConsumer {
    /** Service handling core mail transmission logic. */
    private final MailService mailService;
    private final EmailTemplateService emailTemplateService;
    /**
     * Constructs a new KafkaMailConsumer.
     *
     * @param mailService the mail service
     */
    public KafkaMailConsumer(MailService mailService, EmailTemplateService emailTemplateService) {
        this.mailService = mailService;
        this.emailTemplateService = emailTemplateService;
    }


    /**
     * Listens to the designated mail topic and triggers batch email sending.
     *
     * @param request the consumed batch mail request payload
     */
    @KafkaListener(topics = "user-created-topic", groupId = "mail-group")
    public void userCreated(UserDTO request) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("username", request.getUsername());

        String subject = "🚀 Bienvenido a la plataforma";
        String body = emailTemplateService.processTemplate("user-created", variables);

        mailService.sendBatchEmails(
                Collections.singletonList(request.getEmail()),
                subject,
                body
        );

    }


    @KafkaListener(
            topics = "order-paid-topic",
            groupId = "mail-group"
    )
    public void orderConfirmed(OrderDTO request) {

        Map<String, Object> variables = new HashMap<>();

        variables.put("email", request.userEmail());
        variables.put("orderId", request.id());
        variables.put("total", request.totalAmount());
        variables.put("items", request.items());
        variables.put("createdAt", request.createdAt());

        String subject =
                "✅ Pedido confirmado #" +
                        request.id().toString().substring(0, 8);

        String body =
                emailTemplateService.processTemplate(
                        "order-paid",
                        variables
                );

        mailService.sendBatchEmails(
                Collections.singletonList(request.userEmail()),
                subject,
                body
        );
    }
}