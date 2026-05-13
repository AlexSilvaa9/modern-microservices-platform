package com.microservices.user.service;

import com.microservices.user.dto.seo.AnalyticsSummaryDTO;
import com.microservices.user.dto.seo.MonthlyVisitsDTO;
import com.microservices.user.dto.seo.PageVisitsDTO;
import com.microservices.user.repository.UserEventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnalyticsService {

    private final UserEventRepository repo;

    public AnalyticsService(UserEventRepository repo) {
        this.repo = repo;
    }

    public AnalyticsSummaryDTO getSummary() {

        long totalVisits = repo.countByEventType("PAGE_VIEW");

        List<PageVisitsDTO> byPage = repo.countVisitsByPage()
                .stream()
                .map(r -> new PageVisitsDTO(
                        (String) r[0],
                        ((Number) r[1]).longValue()
                ))
                .toList();

        List<MonthlyVisitsDTO> byMonth = repo.countVisitsByMonth()
                .stream()
                .map(r -> new MonthlyVisitsDTO(
                        (String) r[0],
                        ((Number) r[1]).longValue()
                ))
                .toList();

        return new AnalyticsSummaryDTO(
                totalVisits,
                byPage,
                byMonth
        );
    }
}