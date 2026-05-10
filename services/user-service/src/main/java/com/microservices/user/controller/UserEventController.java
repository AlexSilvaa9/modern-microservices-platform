package com.microservices.user.controller;

import com.microservices.user.dto.seo.UserEventDTO;
import com.microservices.user.service.UserEventService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
public class UserEventController {

    private final UserEventService service;

    public UserEventController(UserEventService service) {
        this.service = service;
    }

    @PostMapping
    public void trackEvent(
            @RequestBody UserEventDTO dto
    ) {
        service.saveEvent(dto);
    }

    @PostMapping("/batch")
    public void trackEvents(
            @RequestBody List<UserEventDTO> dtos) {
        service.saveEvents(dtos);
    }
}