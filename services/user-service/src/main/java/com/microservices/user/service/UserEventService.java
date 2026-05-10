package com.microservices.user.service;

import com.microservices.user.dto.seo.UserEventDTO;
import com.microservices.user.model.UserEventEntity;
import com.microservices.user.repository.UserEventRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserEventService {

    private final UserEventRepository repository;

    public UserEventService(UserEventRepository repository) {
        this.repository = repository;
    }

    public void saveEvent(UserEventDTO dto) {

        UserEventEntity event = new UserEventEntity(
                null,
                dto.userId(),
                dto.eventType(),
                dto.path(),
                LocalDateTime.now(),
                dto.metadataJson()
        );

        repository.save(event);
    }

    public void saveEvents(List<UserEventDTO> dtos) {

        List<UserEventEntity> events = dtos.stream()
                .map(dto -> new UserEventEntity(
                        null,
                        dto.userId(),
                        dto.eventType(),
                        dto.path(),
                        LocalDateTime.now(),
                        dto.metadataJson()
                ))
                .toList();

        repository.saveAll(events);
    }
}