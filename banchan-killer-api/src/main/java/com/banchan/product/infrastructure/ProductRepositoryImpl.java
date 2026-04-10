package com.banchan.product.infrastructure;

import com.banchan.product.domain.Product;
import com.banchan.product.domain.ProductCategory;
import com.banchan.product.domain.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ProductRepositoryImpl implements ProductRepository {

    private final ProductJpaRepository jpaRepository;

    @Override
    public Product save(Product product) {
        return jpaRepository.save(product);
    }

    @Override
    public Optional<Product> findById(Long id) {
        return jpaRepository.findById(id);
    }

    @Override
    public List<Product> findAll() {
        return jpaRepository.findAll();
    }

    @Override
    public Page<Product> findAll(Pageable pageable) {
        return jpaRepository.findAll(pageable);
    }

    @Override
    public List<Product> findByCategory(ProductCategory category) {
        return jpaRepository.findByCategory(category);
    }

    @Override
    public Page<Product> findByCategory(ProductCategory category, Pageable pageable) {
        return jpaRepository.findByCategory(category, pageable);
    }

    @Override
    public void delete(Product product) {
        jpaRepository.delete(product);
    }
}
