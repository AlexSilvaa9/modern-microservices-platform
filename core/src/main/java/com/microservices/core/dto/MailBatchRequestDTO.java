package com.microservices.core.dto;

import java.util.List;


/**
 * Data Transfer Object representing a request to send a batch of emails.
 *
 * @param recipients the list of target email addresses
 * @param subject    the subject line of the email
 * @param html       the HTML content of the email body
 */
public record MailBatchRequestDTO(
        List<String> recipients,
        String subject,
        String html
) {}