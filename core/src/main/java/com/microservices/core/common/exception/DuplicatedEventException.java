package com.microservices.core.common.exception;

public class DuplicatedEventException
        extends RuntimeException {

    public DuplicatedEventException(String eventId) {
        super("Evento ya procesado: " + eventId);
    }
}