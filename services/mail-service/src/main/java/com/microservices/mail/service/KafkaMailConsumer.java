package com.microservices.mail.service;

import com.microservices.core.dto.MailBatchRequestDTO;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

/**
 * Kafka listener service that consumes mail batch requests.
 * Processes asynchronous email dispatch via message brokering.
 */
@Service
public class KafkaMailConsumer {
    /** Service handling core mail transmission logic. */
    private final MailService mailService;

    /**
     * Constructs a new KafkaMailConsumer.
     *
     * @param mailService the mail service
     */
    public KafkaMailConsumer(MailService mailService) {
        this.mailService = mailService;
    }

    /**
     * Listens to the designated mail topic and triggers batch email sending.
     *
     * @param request the consumed batch mail request payload
     */
    @KafkaListener(topics = "mail-topic", groupId = "mail-group")
    public void listen(MailBatchRequestDTO request) {

        mailService.sendBatchEmails(
                request.recipients(),
                request.subject(),
                request.html()
        );

    }
}