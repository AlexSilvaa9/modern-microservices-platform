package com.microservices.user.mapper;

import com.microservices.core.dto.UserDTO;
import org.mapstruct.Mapper;

import com.microservices.user.model.UserEntity;

/**
 * MapStruct mapper para UserEntity <-> UserDTO.
 */
@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO toDTO(UserEntity entity);
    UserEntity fromDTO(UserDTO dto);
}

