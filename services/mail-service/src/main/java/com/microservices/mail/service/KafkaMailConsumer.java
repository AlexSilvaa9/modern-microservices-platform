package com.microservices.mail.service;

import com.microservices.core.dto.MailBatchRequestDTO;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service

public class KafkaMailConsumer {
    private final MailService mailService;

    public KafkaMailConsumer(MailService mailService) {
        this.mailService = mailService;
    }

    @KafkaListener(topics = "mail-topic", groupId = "mail-group")
    public void listen(MailBatchRequestDTO request) {

        mailService.sendBatchEmails(
                request.recipients(),
                request.subject(),
                request.html()
        );

    }
}