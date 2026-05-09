package com.microservices.cart.mapper;

import com.microservices.cart.dto.CartItemDTO;
import com.microservices.cart.model.CartItemEntity;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

/**
 * MapStruct interface for mapping CartItem entities to DTOs and vice versa.
 */
@Mapper(componentModel = "spring", unmappedSourcePolicy = ReportingPolicy.IGNORE)public interface CartItemMapper {

    /**
     * Converts a CartItem entity to a DTO.
     * The product field is ignored and populated later via the Product Service.
     *
     * @param entity the cart item entity
     * @return the mapped DTO
     */
    @Mapping(target = "product", ignore = true)
    CartItemDTO toDTO(CartItemEntity entity);

    /**
     * Converts a CartItem DTO back to an entity.
     * Uses inverse configuration from the toDTO method.
     *
     * @param dto the cart item DTO
     * @return the mapped entity
     */

    @InheritInverseConfiguration
    CartItemEntity fromDTO(CartItemDTO dto);



}
