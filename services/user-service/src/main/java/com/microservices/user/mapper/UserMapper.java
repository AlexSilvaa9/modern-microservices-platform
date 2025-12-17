package com.microservices.user.mapper;

import org.mapstruct.Mapper;

import com.microservices.user.dto.UserDTO;
import com.microservices.user.model.UserEntity;

/**
 * MapStruct mapper para UserEntity <-> UserDTO.
 */
@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO toDTO(UserEntity entity);
    UserEntity fromDTO(UserDTO dto);
}

