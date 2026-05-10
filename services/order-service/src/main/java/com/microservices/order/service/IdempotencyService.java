package com.microservices.order.service;

import com.microservices.order.model.IdempotentProcessedEventEntity;
import com.microservices.order.repository.IdempotentProcessedEventEntityRepository;
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
    public boolean checkAndSaveEvent(
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

            return true;

        } catch (DataIntegrityViolationException e) {

            // UNIQUE constraint saltó
            // evento ya procesado previamente
            return false;
        }
    }
}