package com.microservices.mail.controller;

import com.microservices.core.common.dto.BaseApiResponse;
import com.microservices.core.common.dto.MailBatchRequestDTO;
import com.microservices.mail.service.MailService;
import org.jspecify.annotations.NullMarked;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for triggering email transmissions.
 * Requires ADMIN role for all endpoints.
 */
@RestController
@PreAuthorize("hasRole('ADMIN')")
public class MailController {

    /** Service handling core mail transmission logic. */
    private final MailService mailService;

    /**
     * Constructs a new MailController.
     *
     * @param mailService the mail service
     */
    public MailController(MailService mailService) {
        this.mailService = mailService;
    }

    /**
     * Sends a single email to a specified recipient.
     *
     * @param to      the recipient's email address
     * @param subject the subject line of the email
     * @param html    the HTML content of the email body
     * @return a successful response indicating the mail was sent
     */
    @PostMapping("/send")
    @NullMarked
    public ResponseEntity<BaseApiResponse<Object>> send(@RequestParam(name = "to") String to,
                       @RequestParam(name = "subject") String subject,
                       @RequestBody String html) {

        mailService.sendEmail(to, subject, html);

        BaseApiResponse<Object> baseApiResponse = new BaseApiResponse<>("MAIL.SENT","");

        return ResponseEntity.ok().body(baseApiResponse);
    }

    /**
     * Sends a batch of identical emails to multiple recipients.
     *
     * @param request the DTO containing recipients, subject, and HTML body
     * @return a successful response indicating the batch was processed
     */
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