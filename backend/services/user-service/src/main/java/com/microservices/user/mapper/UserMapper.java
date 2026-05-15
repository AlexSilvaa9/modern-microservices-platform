package com.microservices.user.mapper;

import com.microservices.core.common.dto.UserDTO;
import org.mapstruct.Mapper;

import com.microservices.user.model.UserEntity;
import org.mapstruct.Mapping;


/**
 * MapStruct interface for converting between UserEntity and UserDTO.
 * Automatically generates the implementation at compile time.
 */
@Mapper(componentModel = "spring")
public interface UserMapper {
    /**
     * Converts a database UserEntity into a data transfer object.
     *
     * @param entity the user entity
     * @return the mapped user DTO
     */
    UserDTO toDTO(UserEntity entity);

    /**
     * Converts a user data transfer object back into a database entity.
     * Ignores security attributes and auto-generated fields which are set separately.
     *
     * @param dto the user DTO
     * @return the mapped user entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "accountNonExpired", ignore = true)
    @Mapping(target = "accountNonLocked", ignore = true)
    @Mapping(target = "credentialsNonExpired", ignore = true)
    UserEntity fromDTO(UserDTO dto);
}

