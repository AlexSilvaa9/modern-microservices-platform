package com.microservices.order.idempotency.service;

import com.microservices.core.common.exception.DuplicatedEventException;
import com.microservices.order.idempotency.model.IdempotentProcessedEventEntity;
import com.microservices.order.idempotency.repository.IdempotentProcessedEventEntityRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class IdempotencyService {

    private final IdempotentProcessedEventEntityRepository repository;

    public IdempotencyService(IdempotentProcessedEventEntityRepository repository) {
        this.repository = repository;
    }

    /**
     * Intenta registrar un evento como procesado.
     *
     * @param eventId   ID único del evento (Stripe/Kafka/etc)
     * @param eventType tipo de evento
     * @param source    origen del evento
     * @return true si el evento es nuevo y puede procesarse
     *         false si ya fue procesado antes
     */
    @Transactional
    public void checkAndSaveEvent(
            String eventId,
            String eventType,
            String source
    ) {

        try {

            repository.saveAndFlush(
                    new IdempotentProcessedEventEntity(
                            eventId,
                            eventType,
                            source
                    )
            );


        } catch (DataIntegrityViolationException e) {

            // UNIQUE constraint saltó
            // evento ya procesado previamente
            throw new DuplicatedEventException(eventId);
        }
    }
}