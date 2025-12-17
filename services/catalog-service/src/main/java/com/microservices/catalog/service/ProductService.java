package com.microservices.catalog.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import jakarta.validation.constraints.NotNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.microservices.catalog.dao.ProductDAO;
import com.microservices.catalog.dto.ProductDTO;
import com.microservices.catalog.mapper.ProductMapper;
import com.microservices.catalog.model.ProductEntity;

/**
 * Servicio de dominio encargado de operaciones sobre productos.
 * Encapsula la lógica de consulta y transformación entre entidades y DTO.
 */
@Service
@Transactional
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
    public List<ProductDTO> getAllActiveProducts() {
        List<ProductEntity> entities = productDAO.findAllActive();
        return entities.stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene un producto por su identificador.
     *
     * @param id identificador del producto
     * @return Optional con el {@link ProductDTO} si existe, o empty si no
     */
    public Optional<ProductDTO> getProductById(Long id) {
        return productDAO.findById(id).map(productMapper::toDTO);
    }

    /**
     * Obtiene los productos activos de una categoría dada.
     *
     * @param category nombre de la categoría
     * @return lista de {@link ProductDTO} en la categoría (puede estar vacía)
     */
    public List<ProductDTO> getProductsByCategory(String category) {
        List<ProductEntity> entities = productDAO.findByCategory(category);
        return entities.stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Busca productos por nombre (contiene, case-sensitive según configuración de BD).
     *
     * @param name fragmento de nombre a buscar
     * @return lista de {@link ProductDTO} cuyos nombres contienen el fragmento
     */
    public List<ProductDTO> searchProductsByName(String name) {
        List<ProductEntity> entities = productDAO.searchByName(name);
        return entities.stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
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
