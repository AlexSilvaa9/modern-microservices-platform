package com.microservices.cart.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import java.util.List;

import com.microservices.cart.dto.CartItemDTO;
import com.microservices.cart.dto.ShoppingCartDTO;
import com.microservices.cart.model.CartItemEntity;
import com.microservices.cart.model.ShoppingCartEntity;

/**
 * Mapper MapStruct para convertir entre entidades del dominio y DTOs.
 */
@Mapper(componentModel = "spring")
public interface CartMapper {

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

    /**
     * Convierte una entidad de carrito a su DTO. MapStruct mapeará la lista de items.
     *
     * @param entity entidad de carrito
     * @return DTO del carrito
     */
    ShoppingCartDTO toDTO(ShoppingCartEntity entity);

    /**
     * Convierte un DTO de carrito a su entidad.
     *
     * @param dto DTO del carrito
     * @return entidad correspondiente
     */
    ShoppingCartEntity fromDTO(ShoppingCartDTO dto);

    /**
     * Convierte una lista de entidades de items a DTOs.
     */
    List<CartItemDTO> toItemDTOs(List<CartItemEntity> entities);

    /**
     * Convierte una lista de DTOs de items a entidades.
     */
    List<CartItemEntity> fromItemDTOs(List<CartItemDTO> dtos);

    /**
     * Actualiza una entidad de item existente a partir de un DTO (merge).
     * El id se ignora para no sobrescribir la clave primaria.
     *
     * @param dto datos de entrada
     * @param entity entidad a actualizar
     */
    @Mapping(target = "id", ignore = true)
    void updateEntityFromDTO(CartItemDTO dto, @MappingTarget CartItemEntity entity);

}
