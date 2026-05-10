package com.microservices.mail.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailTemplateService {

    private final TemplateEngine templateEngine;

    public String processTemplate(
            String templateName,
            Map<String, Object> variables
    ) {

        Context context = new Context();

        context.setVariables(variables);

        return templateEngine.process(
                "emails/" + templateName,
                context
        );
    }
}