package com.microservices.order.mapper;

import com.microservices.core.dto.CartItemDTO;
import com.microservices.core.dto.ProductDTO;
import com.microservices.core.dto.ShoppingCartDTO;
import com.microservices.core.dto.order.OrderDTO;
import com.microservices.order.model.OrderItemEntity;
import com.microservices.order.model.ProductSnapshot;
import org.mapstruct.Mapper;


import com.microservices.order.model.OrderEntity;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    OrderEntity toEntity(OrderDTO dto);


    @Mapping(source = "id", target = "productId")
    ProductSnapshot productToProductSnapshot(ProductDTO dto);
    OrderDTO toDTO(OrderEntity entity);



    @Mapping(target = "id",ignore = true)
    @Mapping(target = "createdAt",ignore = true)
    @Mapping(target = "updatedAt",ignore = true)
    OrderEntity fromCartToEntity(ShoppingCartDTO cartDTO);

    @Mapping(target = "id",ignore = true)
    @Mapping(source = "product", target = "productSnapshotEntity")
    OrderItemEntity cartItemToOrderItem(CartItemDTO dto);
}
