package com.microservices.core.dto;

import java.util.List;


public record MailBatchRequestDTO(
        List<String> recipients,
        String subject,
        String html

){}