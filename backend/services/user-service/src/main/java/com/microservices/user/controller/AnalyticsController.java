package com.microservices.user.controller;

import com.microservices.user.dto.seo.AnalyticsSummaryDTO;
import com.microservices.user.service.AnalyticsService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/analytics")
@PreAuthorize("hasRole('ADMIN')")
public class AnalyticsController {

    private final AnalyticsService service;

    public AnalyticsController(AnalyticsService service) {
        this.service = service;
    }

    @GetMapping("/summary")
    public AnalyticsSummaryDTO getSummary() {
        return service.getSummary();
    }
}