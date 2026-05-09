package com.microservices.product.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.microservices.core.dto.ProductDTO;
import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.microservices.product.dao.ProductDAO;
import com.microservices.product.mapper.ProductMapper;
import com.microservices.product.model.ProductEntity;

/**
 * Core domain service handling product catalog business logic.
 * Encapsulates operations for retrieving and searching active products.
 */
@Service
@Transactional
@Slf4j
public class ProductService {


    /** Data access object for database interactions. */
    private final ProductDAO productDAO;

    /** Mapper for transforming entities to DTOs. */
    private final ProductMapper productMapper;

    /**
     * Constructs a new ProductService.
     *
     * @param productDAO    the product data access object
     * @param productMapper the product entity-DTO mapper
     */
    public ProductService(ProductDAO productDAO, ProductMapper productMapper) {
        this.productDAO = productDAO;
        this.productMapper = productMapper;
    }

    /**
     * Retrieves a paginated list of all products currently marked as active.
     *
     * @param pageable pagination configuration
     * @return a page containing the mapped product DTOs
     */
    public Page<ProductDTO> getAllActiveProducts(Pageable pageable) {
        Page<ProductEntity> entities = productDAO.findAllActive(pageable);
        log.info(entities.toString());
        return entities.map(productMapper::toDTO);
    }

    /**
     * Retrieves a specific product by its UUID.
     *
     * @param id the UUID of the product
     * @return an Optional containing the mapped product DTO if found
     */
    public Optional<ProductDTO> getProductById(UUID id) {
        return productDAO.findById(id).map(productMapper::toDTO);
    }

    /**
     * Retrieves multiple products by their exact UUIDs.
     *
     * @param uuids the list of product UUIDs to fetch
     * @return a list of mapped product DTOs
     */
    public List<ProductDTO> getProductsById(List<UUID> uuids) {
        return productDAO.findAllById(uuids)
                .stream()
                .map(productMapper::toDTO)
                .toList();
    }


    /**
     * Retrieves all active products belonging to a specific category.
     *
     * @param category the category name to filter by
     * @return a list of matching product DTOs
     */
    public @NotNull List<ProductDTO> getProductsByCategory(String category) {
        List<ProductEntity> entities = productDAO.findByCategory(category);
        return entities.stream()
                .map(productMapper::toDTO)
                .toList();
    }

    /**
     * Searches for active products whose name contains the specified string.
     *
     * @param name the substring to search for within product names
     * @return a list of matching product DTOs
     */
    public @NotNull List<ProductDTO> searchProductsByName(String name) {
        List<ProductEntity> entities = productDAO.searchByName(name);
        return entities.stream()
                .map(productMapper::toDTO)
                .toList();
    }

    /**
     * Retrieves a unique list of all categories that currently have active products.
     *
     * @return a distinct list of category names
     */
    public @NotNull List<String> getAllCategories() {
        return productDAO.findDistinctCategories();
    }

}
