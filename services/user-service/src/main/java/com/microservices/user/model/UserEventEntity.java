package com.microservices.user.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_event")
@Getter
@Setter
@AllArgsConstructor
public class UserEventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String userId;

    private String eventType;

    private String path;

    private LocalDateTime createdAt;

    @Column(columnDefinition = "TEXT")
    private String metadataJson;


}