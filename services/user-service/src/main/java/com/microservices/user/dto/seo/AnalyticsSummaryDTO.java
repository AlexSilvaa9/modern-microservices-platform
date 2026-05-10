package com.microservices.user.dto.seo;

import java.util.List;

public record AnalyticsSummaryDTO(
        long totalVisits,
        List<PageVisitsDTO> visitsByPage,
        List<MonthlyVisitsDTO> visitsByMonth
) {}