package com.banchan.product.infrastructure;

import com.banchan.product.domain.Product;
import com.banchan.product.domain.ProductCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

interface ProductJpaRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(ProductCategory category);
    Page<Product> findByCategory(ProductCategory category, Pageable pageable);
}
