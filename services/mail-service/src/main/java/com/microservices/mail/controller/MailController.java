package com.microservices.mail.controller;

import com.microservices.core.dto.BaseApiResponse;
import com.microservices.core.dto.MailBatchRequestDTO;
import com.microservices.mail.service.MailService;
import org.jspecify.annotations.NullMarked;
import org.springframework.http.ResponseEntity;
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
    @NullMarked
    public ResponseEntity<BaseApiResponse<Object>> send(@RequestParam(name = "to") String to,
                       @RequestParam(name = "subject") String subject,
                       @RequestBody String html) {

        mailService.sendEmail(to, subject, html);

        BaseApiResponse<Object> baseApiResponse = new BaseApiResponse<>("MAIL.SENT","");

        return ResponseEntity.ok().body(baseApiResponse);
    }

    @PostMapping("/batch")
    @NullMarked
    public ResponseEntity<BaseApiResponse<Object>> batch(@RequestBody MailBatchRequestDTO request) {

        mailService.sendBatchEmails(
                request.recipients(),
                request.subject(),
                request.html()
        );

        BaseApiResponse<Object> baseApiResponse = new BaseApiResponse<>("MAIL.SENT","");

        return ResponseEntity.ok().body(baseApiResponse);
    }
}