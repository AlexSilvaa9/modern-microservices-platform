package com.microservices.user.mapper;

import com.microservices.core.dto.UserDTO;
import org.mapstruct.Mapper;

import com.microservices.user.model.UserEntity;
import org.mapstruct.Mapping;

import java.util.List;

/**
 * MapStruct mapper para UserEntity <-> UserDTO.
 */
@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO toDTO(UserEntity entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "accountNonExpired", ignore = true)
    @Mapping(target = "accountNonLocked", ignore = true)
    @Mapping(target = "credentialsNonExpired", ignore = true)
    @Mapping(target = "enabled", ignore = true)
    UserEntity fromDTO(UserDTO dto);
}

