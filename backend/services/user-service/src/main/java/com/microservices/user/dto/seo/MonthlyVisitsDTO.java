package com.microservices.user.dto.seo;

public record MonthlyVisitsDTO(
        String month,
        long visits
) {}