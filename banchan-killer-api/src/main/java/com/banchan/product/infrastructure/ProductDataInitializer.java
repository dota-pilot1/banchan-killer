package com.banchan.product.infrastructure;

import com.banchan.product.domain.Product;
import com.banchan.product.domain.ProductCategory;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class ProductDataInitializer implements CommandLineRunner {

    private final ProductJpaRepository productJpaRepository;
    private static final Set<String> LEGACY_SAMPLE_NAMES = Set.of(
            "한입 메추리알 장조림",
            "소고기 무국",
            "직화 제육볶음",
            "아삭 깍두기"
    );

    @Override
    public void run(String... args) {
        List<Product> sampleProducts = List.of(
                Product.builder()
                        .name("꽈리고추 볶음")
                        .description("한 끼에 부담 없이 덜어 먹기 좋은 짭조름한 야채 밑반찬입니다.")
                        .price(3900)
                        .stockQuantity(40)
                        .category(ProductCategory.SIDE_DISH)
                        .imageUrl("https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80")
                        .build(),
                Product.builder()
                        .name("콩나물 무침")
                        .description("가볍게 비벼 먹기 좋은 기본 반찬으로 식탁에 늘 잘 어울립니다.")
                        .price(2900)
                        .stockQuantity(45)
                        .category(ProductCategory.SIDE_DISH)
                        .imageUrl("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80")
                        .build(),
                Product.builder()
                        .name("메추리알 볶음")
                        .description("짭조름한 양념이 잘 밴 메추리알 반찬으로 혼밥 반찬으로 딱 좋습니다.")
                        .price(4900)
                        .stockQuantity(32)
                        .category(ProductCategory.MAIN_COURSE)
                        .imageUrl("https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80")
                        .build(),
                Product.builder()
                        .name("돼지불고기")
                        .description("전자레인지로 데워 바로 먹기 좋은 실속형 고기 반찬입니다.")
                        .price(5900)
                        .stockQuantity(24)
                        .category(ProductCategory.MAIN_COURSE)
                        .imageUrl("https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80")
                        .build(),
                Product.builder()
                        .name("파김치")
                        .description("알싸한 풍미가 살아 있어 밥 한 공기 뚝딱 가능한 기본 김치 반찬입니다.")
                        .price(5900)
                        .stockQuantity(28)
                        .category(ProductCategory.KIMCHI)
                        .imageUrl("https://images.unsplash.com/photo-1607301405390-d831c242f59b?auto=format&fit=crop&w=800&q=80")
                        .build(),
                Product.builder()
                        .name("배추김치")
                        .description("매일 먹기 좋은 익숙한 맛으로 자취 식탁에 빠지지 않는 반찬입니다.")
                        .price(4900)
                        .stockQuantity(35)
                        .category(ProductCategory.KIMCHI)
                        .imageUrl("https://images.unsplash.com/photo-1583224964978-2c9b6d7b3486?auto=format&fit=crop&w=800&q=80")
                        .build()
        );

        List<Product> existingProducts = productJpaRepository.findAll();

        if (existingProducts.isEmpty()) {
            productJpaRepository.saveAll(sampleProducts);
            return;
        }

        Set<String> existingNames = new HashSet<>(existingProducts.stream().map(Product::getName).toList());
        if (existingProducts.size() <= LEGACY_SAMPLE_NAMES.size() && LEGACY_SAMPLE_NAMES.containsAll(existingNames)) {
            productJpaRepository.deleteAll();
            productJpaRepository.saveAll(sampleProducts);
        }
    }
}
