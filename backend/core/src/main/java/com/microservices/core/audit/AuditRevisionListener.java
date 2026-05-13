package com.microservices.core.audit;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.hibernate.envers.RevisionListener;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AuditRevisionListener implements RevisionListener {

    @Override
    public void newRevision(Object revisionEntity) {

        AuditRevisionEntity rev =
                (AuditRevisionEntity) revisionEntity;

        // =========================
        // SECURITY (JWT via Spring Security)
        // =========================
        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        if (auth != null) {

            rev.setUserEmail(auth.getName());

            String roles = auth.getAuthorities()
                    .stream()
                    .map(Object::toString)
                    .collect(Collectors.joining(","));

            rev.setRoles(roles);
        }

        // =========================
        // REQUEST CONTEXT
        // =========================
        ServletRequestAttributes attrs =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        if (attrs != null) {

            HttpServletRequest request =
                    attrs.getRequest();

            rev.setIp(getClientIp(request));
            rev.setUserAgent(request.getHeader("User-Agent"));
        }

    }

    private String getClientIp(HttpServletRequest request) {

        String xfHeader = request.getHeader("X-Forwarded-For");

        if (xfHeader != null) {
            return xfHeader.split(",")[0];
        }

        return request.getRemoteAddr();
    }
}