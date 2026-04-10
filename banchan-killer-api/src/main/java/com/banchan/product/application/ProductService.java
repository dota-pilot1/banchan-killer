package com.banchan.product.application;

import com.banchan.product.domain.Product;
import com.banchan.product.domain.ProductCategory;
import com.banchan.product.domain.ProductNotFoundException;
import com.banchan.product.domain.ProductRepository;
import com.banchan.product.presentation.ProductRequest;
import com.banchan.product.presentation.ProductResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Product product = Product.builder()
                .name(request.name())
                .description(request.description())
                .price(request.price())
                .stockQuantity(request.stockQuantity())
                .category(request.category())
                .imageUrl(request.imageUrl())
                .build();

        Product savedProduct = productRepository.save(product);
        return ProductResponse.from(savedProduct);
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(ProductResponse::from)
                .collect(Collectors.toList());
    }

    public Page<ProductResponse> getProducts(Pageable pageable, ProductCategory category) {
        if (category != null) {
            return productRepository.findByCategory(category, pageable)
                    .map(ProductResponse::from);
        }
        return productRepository.findAll(pageable)
                .map(ProductResponse::from);
    }

    public ProductResponse getProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        return ProductResponse.from(product);
    }

    public List<ProductResponse> getProductsByCategory(ProductCategory category) {
        return productRepository.findByCategory(category).stream()
                .map(ProductResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        product.update(
                request.name(),
                request.description(),
                request.price(),
                request.stockQuantity(),
                request.category(),
                request.imageUrl(),
                Product.ProductStatus.SALE // Status update logic can be more complex
        );

        return ProductResponse.from(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        productRepository.delete(product);
    }
}
