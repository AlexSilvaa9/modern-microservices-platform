package com.microservices.mail.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MailService {

    @Value("${spring.mail.username}")
    private String username;

    private final JavaMailSender mailSender;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }


    public void sendEmail(String to, String subject, String htmlBody) {
        sendHtml(to, subject, htmlBody);
    }


    public void sendBatchEmails(List<String> recipients,
                                String subject,
                                String htmlBody) {

        for (String to : recipients) {
            sendHtml(to, subject, htmlBody);
        }
    }


    private void sendHtml(String to, String subject, String htmlBody) {
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
            throw new RuntimeException("Error sending email to " + to, e);
        }
    }
}