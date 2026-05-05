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
 * Servicio de dominio encargado de operaciones sobre productos.
 * Encapsula la lógica de consulta y transformación entre entidades y DTO.
 */
@Service
@Transactional
@Slf4j
public class ProductService {


    private final ProductDAO productDAO;


    private final ProductMapper productMapper;

    public ProductService(ProductDAO productDAO, ProductMapper productMapper) {
        this.productDAO = productDAO;
        this.productMapper = productMapper;
    }

    /**
     * Obtiene todos los productos marcados como activos y los transforma a DTOs.
     *
     * @return lista de {@link ProductDTO} activos (puede estar vacía, no nula)
     */
    public Page<ProductDTO> getAllActiveProducts(Pageable pageable) {
        Page<ProductEntity> entities = productDAO.findAllActive(pageable);
        log.info(entities.toString());
        return entities.map(productMapper::toDTO);
    }

    /**
     * Obtiene un producto por su identificador.
     *
     * @param id identificador del producto
     * @return Optional con el {@link ProductDTO} si existe, o empty si no
     */
    public Optional<ProductDTO> getProductById(UUID id) {
        return productDAO.findById(id).map(productMapper::toDTO);
    }

    /**
     * Obtiene un producto por su identificador.
     *
     * @param uuids identificador del producto
     * @return Optional con el {@link ProductDTO} si existe, o empty si no
     */
    public List<ProductDTO> getProductsById(List<UUID> uuids) {
        return productDAO.findAllById(uuids)
                .stream()
                .map(productMapper::toDTO)
                .toList();
    }


    /**
     * Obtiene los productos activos de una categoría dada.
     *
     * @param category nombre de la categoría
     * @return lista de {@link ProductDTO} en la categoría (puede estar vacía)
     */
    public @NotNull List<ProductDTO> getProductsByCategory(String category) {
        List<ProductEntity> entities = productDAO.findByCategory(category);
        return entities.stream()
                .map(productMapper::toDTO)
                .toList();
    }

    /**
     * Busca productos por nombre (contiene, case-sensitive según configuración de BD).
     *
     * @param name fragmento de nombre a buscar
     * @return lista de {@link ProductDTO} cuyos nombres contienen el fragmento
     */
    public @NotNull List<ProductDTO> searchProductsByName(String name) {
        List<ProductEntity> entities = productDAO.searchByName(name);
        return entities.stream()
                .map(productMapper::toDTO)
                .toList();
    }

    /**
     * Obtiene la lista de categorías distintas presentes en productos activos.
     *
     * @return lista de nombres de categoría (puede estar vacía)
     */
    public @NotNull List<String> getAllCategories() {
        return productDAO.findDistinctCategories();
    }

}
