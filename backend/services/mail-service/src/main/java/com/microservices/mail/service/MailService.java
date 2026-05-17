package com.microservices.mail.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Core service handling the actual transmission of emails.
 * Interfaces with the underlying JavaMailSender.
 */
@Service
@Slf4j
public class MailService {

    /** The configured sender email address. */
    @Value("${spring.mail.username}")
    private String username;

    @Value("${mail.enabled:true}")
    private boolean mailEnabled;

    /** The underlying Spring JavaMail component. */
    private final JavaMailSender mailSender;

    /**
     * Constructs a new MailService.
     *
     * @param mailSender the JavaMail sender instance
     */
    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }


    /**
     * Sends a single HTML email.
     *
     * @param to       the recipient's email address
     * @param subject  the subject of the email
     * @param htmlBody the HTML content to send
     */
    public void sendEmail(String to, String subject, String htmlBody) {
        sendHtml(to, subject, htmlBody);
    }


    /**
     * Iterates over a list of recipients and sends the same HTML email to each.
     *
     * @param recipients the list of email addresses
     * @param subject    the subject of the email
     * @param htmlBody   the HTML content to send
     */
    public void sendBatchEmails(List<String> recipients,
                                String subject,
                                String htmlBody) {

        for (String to : recipients) {
            sendHtml(to, subject, htmlBody);
        }
    }


    private void sendHtml(String to, String subject, String htmlBody) {
        if(!mailEnabled){
            return;
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setFrom(username);

            // true = HTML enabled
            helper.setText(htmlBody, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            log.error("error enviando correo: {}", e.getMessage());
        }
    }
}