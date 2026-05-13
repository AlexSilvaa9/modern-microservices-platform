package com.microservices.core.common.security;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * Feign interceptor that propagates incoming HTTP cookies
 * from the current request to downstream microservice calls.
 */
@Component
public class FeignCookieInterceptor implements RequestInterceptor {

    @Override
    public void apply(RequestTemplate template) {

        ServletRequestAttributes attributes =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        if (attributes == null) {
            return;
        }

        HttpServletRequest request = attributes.getRequest();

        String cookieHeader = request.getHeader("Cookie");

        if (cookieHeader != null && !cookieHeader.isEmpty()) {
            template.header("Cookie", cookieHeader);
        }
    }
}