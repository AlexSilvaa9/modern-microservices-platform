package com.microservices.product.mapper;

import com.microservices.core.common.dto.ProductDTO;
import org.mapstruct.Mapper;

import com.microservices.product.model.ProductEntity;

/**
 * MapStruct interface for converting between ProductEntity and ProductDTO.
 * Automatically generates the implementation at compile time.
 */
@Mapper(componentModel = "spring")
public interface ProductMapper {
    /**
     * Converts a database ProductEntity into a data transfer object.
     *
     * @param producto the product entity
     * @return the mapped product DTO
     */
    ProductDTO toDTO(ProductEntity producto);

    /**
     * Converts a product data transfer object back into a database entity.
     *
     * @param dto the product DTO
     * @return the mapped product entity
     */
    ProductEntity fromDTO(ProductDTO dto);
}
