package com.microservices.cart.mapper;

import com.microservices.core.dto.ShoppingCartDTO;
import org.mapstruct.Mapper;


import com.microservices.cart.model.ShoppingCartEntity;

/**
 * MapStruct interface for mapping ShoppingCart entities to DTOs and vice versa.
 */
@Mapper(componentModel = "spring")
public interface ShoppingCartMapper {

    /**
     * Converts a ShoppingCart entity to its corresponding DTO.
     * Automatically maps the collection of items.
     *
     * @param entity the shopping cart entity
     * @return the mapped DTO
     */
    ShoppingCartDTO toDTO(ShoppingCartEntity entity);

    /**
     * Converts a ShoppingCart DTO back into an entity.
     *
     * @param dto the shopping cart DTO
     * @return the mapped entity
     */
    ShoppingCartEntity fromDTO(ShoppingCartDTO dto);



}
