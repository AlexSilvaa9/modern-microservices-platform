package com.microservices.user.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.microservices.core.common.dto.enums.Language;
import com.microservices.core.common.dto.enums.Role;
import com.microservices.core.common.exception.NotFoundException;
import com.microservices.core.common.dto.UserDTO;
import com.microservices.core.common.dto.enums.IdentityProvider;
import com.microservices.user.model.UserEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.microservices.user.dao.UserDAO;
import com.microservices.user.mapper.UserMapper;

/**
 * Service handling core user queries and profile updates.
 * Acts as an intermediary between the controllers and data access layer.
 */
@Service
public class UserService {

    /** Data Access Object for user database operations. */
    private final UserDAO dao;
    /** Mapper for converting between UserEntity and UserDTO. */
    private final UserMapper mapper;

    /**
     * Constructs a new UserService.
     *
     * @param dao    the user data access object
     * @param mapper the mapper for user DTOs
     */
    public UserService(UserDAO dao, UserMapper mapper) {
        this.dao = dao;
        this.mapper = mapper;
    }

    /**
     * Finds a user by their unique identifier.
     *
     * @param id the UUID of the user
     * @return an Optional containing the UserDTO if found, otherwise empty
     */
    public Optional<UserDTO> findById(UUID id) {
        return dao.findById(id).map(mapper::toDTO);
    }

    /**
     * Finds a user by their email address.
     *
     * @param email the email address to search for
     * @return an Optional containing the UserDTO if found, otherwise empty
     */
    public Optional<UserDTO> findByEmail(String email) {
        return dao.findByEmail(email).map(mapper::toDTO);
    }
    /**
     * Retrieves a paginated list of all users.
     *
     * @param pageable the pagination parameters
     * @return a page containing user DTOs
     */
    public Page<UserDTO> findAll(Pageable pageable) {
        return dao.findAllUsers(pageable)
                .map(mapper::toDTO);
    }
    /**
     * Appends an additional identity provider to a user's profile.
     *
     * @param email    the email of the user to update
     * @param provider the identity provider to add
     * @throws NotFoundException if the user is not found
     */
    @Transactional
    public void addProvider(String email, IdentityProvider provider){
        dao.addProvider(email, provider);
    }

    @Transactional
    public void setRoles(UUID uuid, List<Role> roleList){
        UserEntity userEntity = dao.findById(uuid).orElseThrow(() -> new NotFoundException("usuario no existe"));
        userEntity.setRoles(roleList);
        dao.save(userEntity);
    }
    @Transactional
    public void enableUser(UUID uuid){
        UserEntity userEntity = dao.findById(uuid).orElseThrow(() -> new NotFoundException("usuario no existe"));
        userEntity.setEnabled(true);
        dao.save(userEntity);
    }
    @Transactional
    public void disableUser(UUID uuid){
        UserEntity userEntity = dao.findById(uuid).orElseThrow(() -> new NotFoundException("usuario no existe"));
        userEntity.setEnabled(false);
        dao.save(userEntity);
    }

    @Transactional
    public void setPreferredLanguage(UUID uuid, Language language){
        UserEntity userEntity = dao.findById(uuid).orElseThrow(() -> new NotFoundException("usuario no existe"));
        userEntity.setPreferredLanguage(language);
        dao.save(userEntity);
    }
}


