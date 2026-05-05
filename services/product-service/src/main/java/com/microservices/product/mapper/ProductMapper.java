package com.microservices.product.mapper;

import com.microservices.core.dto.ProductDTO;
import org.mapstruct.Mapper;

import com.microservices.product.model.ProductEntity;

/**
 * Mapper interfaz para convertir entre {@link ProductEntity} y {@link ProductDTO}.
 * Implementada por MapStruct con "componentModel = \"spring\"" para inyección.
 */
@Mapper(componentModel = "spring")
public interface ProductMapper {
    /**
     * Convierte una entidad de producto a su DTO correspondiente.
     *
     * @param producto la entidad de producto (no nula)
     * @return el DTO correspondiente
     */
    ProductDTO toDTO(ProductEntity producto);

    /**
     * Convierte un DTO de producto a su entidad persistible.
     *
     * @param dto el DTO de producto (no nulo)
     * @return la entidad de producto para persistencia
     */
    ProductEntity fromDTO(ProductDTO dto);
}
