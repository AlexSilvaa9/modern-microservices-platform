package com.microservices.cart.mapper;

import com.microservices.cart.dto.CartItemDTO;
import com.microservices.cart.model.CartItemEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Mapper MapStruct para convertir entre entidades del dominio y DTOs.
 */
@Mapper(componentModel = "spring")
public interface CartItemMapper {

    /**
     * Convierte una entidad de item a su DTO.
     *
     * @param entity entidad de item
     * @return DTO correspondiente
     */
    CartItemDTO toDTO(CartItemEntity entity);

    /**
     * Convierte un DTO de item a su entidad.
     *
     * @param dto DTO del item
     * @return entidad correspondiente
     */


    CartItemEntity fromDTO(CartItemDTO dto);



}
