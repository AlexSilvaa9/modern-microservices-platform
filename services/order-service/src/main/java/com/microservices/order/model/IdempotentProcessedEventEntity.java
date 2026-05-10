package com.microservices.order.model;


import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "processed_event",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "event_id")
        }
)
public class IdempotentProcessedEventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "event_id", nullable = false, unique = true)
    private String eventId;

    @Column(name = "event_type")
    private String eventType;

    @Column(name = "source")
    private String source;

    @Column(name = "processed_at", nullable = false)
    private LocalDateTime processedAt;

    public IdempotentProcessedEventEntity(
            String eventId,
            String eventType,
            String source
    ) {
        this.eventId = eventId;
        this.eventType = eventType;
        this.source = source;
        this.processedAt = LocalDateTime.now();
    }
}