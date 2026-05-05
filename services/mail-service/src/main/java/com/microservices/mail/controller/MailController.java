package com.microservices.mail.controller;

import com.microservices.core.dto.MailBatchRequestDTO;
import com.microservices.mail.service.MailService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@PreAuthorize("hasRole('ADMIN')")
public class MailController {

    private final MailService mailService;

    public MailController(MailService mailService) {
        this.mailService = mailService;
    }

    @PostMapping("/send")
    public String send(@RequestParam(name = "to") String to,
                       @RequestParam(name = "subject") String subject,
                       @RequestBody String html) {

        mailService.sendEmail(to, subject, html);
        return "sent";
    }

    @PostMapping("/batch")
    public String batch(@RequestBody MailBatchRequestDTO request) {

        mailService.sendBatchEmails(
                request.recipients(),
                request.subject(),
                request.html()
        );

        return "batch sent";
    }
}