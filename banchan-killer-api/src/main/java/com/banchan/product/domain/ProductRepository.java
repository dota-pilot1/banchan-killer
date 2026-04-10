package com.banchan.product.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ProductRepository {
    Product save(Product product);
    Optional<Product> findById(Long id);
    List<Product> findAll();
    Page<Product> findAll(Pageable pageable);
    List<Product> findByCategory(ProductCategory category);
    Page<Product> findByCategory(ProductCategory category, Pageable pageable);
    void delete(Product product);
}
