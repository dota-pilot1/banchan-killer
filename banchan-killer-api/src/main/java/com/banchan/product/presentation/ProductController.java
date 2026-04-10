package com.banchan.product.presentation;

import com.banchan.product.application.ProductService;
import com.banchan.product.domain.ProductCategory;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Product", description = "상품 관리 및 조회 API")
public class ProductController {

    private final ProductService productService;

    @PostMapping
    @Operation(summary = "상품 등록 (Admin)", description = "새로운 상품을 등록합니다.")
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        ProductResponse response = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "상품 목록 조회", description = "등록된 모든 상품 목록을 페이징하여 조회합니다.")
    public ResponseEntity<Page<ProductResponse>> getProducts(
            @PageableDefault(size = 20) Pageable pageable,
            @RequestParam(required = false) ProductCategory category) {
        return ResponseEntity.ok(productService.getProducts(pageable, category));
    }

    @GetMapping("/{id}")
    @Operation(summary = "상품 상세 조회", description = "ID로 상품 상세 정보를 조회합니다.")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProduct(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "상품 정보 수정 (Admin)", description = "상품의 정보를 수정합니다.")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "상품 삭제 (Admin)", description = "상품을 삭제합니다.")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
