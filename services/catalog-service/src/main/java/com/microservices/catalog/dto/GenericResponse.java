package com.microservices.catalog.dto;

import lombok.Data;
import lombok.experimental.SuperBuilder;

import java.util.List;

/**
 * Contenedor genérico para respuestas de la API.
 *
 * @param <T> tipo del payload de datos
 */
@Data
@SuperBuilder
public class GenericResponse<T> {
    /** Indica si la operación fue exitosa */
    private boolean success;

    /** Mensaje informativo */
    private String message;

    /** Lista de errores (si los hubiera) */
    private List<String> errors;

    /** Payload genérico */
    private T data;
}
