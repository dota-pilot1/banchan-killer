package com.banchan.product.infrastructure;

import com.banchan.product.domain.Product;
import com.banchan.product.domain.ProductCategory;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ProductDataInitializer implements CommandLineRunner {

    private final ProductJpaRepository productJpaRepository;

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

        if (productJpaRepository.count() > 0) {
            return;
        }

        productJpaRepository.saveAll(sampleProducts);
    }

    /*
     * 왜 서버 시작과 함께 실행되는가?
     * - 이 클래스는 @Component 가 붙어 있어서 Spring Bean 으로 등록된다.
     * - 동시에 CommandLineRunner 를 구현하고 있기 때문에,
     *   Spring Boot 는 애플리케이션 시작이 끝난 직후 run() 메서드를 자동 실행한다.
     * - 즉, 어디선가 직접 호출하는 구조가 아니라 Spring Boot 시작 규약에 의해 자동 실행된다.
     *
     * 왜 상품이 0개일 때만 기본 데이터를 넣는가?
     * - 이 로직은 개발 전용 기본 반찬 데이터 세팅을 위한 코드다.
     * - 처음 실행한 개발 환경에서는 상품 테이블이 비어 있을 수 있으므로
     *   그때만 saveAll()로 샘플 반찬 데이터를 한 번 넣어준다.
     * - 이미 상품이 들어 있다면 return 하여 아무 것도 하지 않는다.
     * - 이렇게 해야 관리자 페이지에서 수정하거나 직접 등록한 상품 정보가
     *   서버 재시작 때문에 덮어써지지 않는다.
     * - 실제 운영 단계에서는 관리자가 직접 상품을 입력해야 하므로,
     *   이 방식은 "빈 개발 DB를 빠르게 채우는 초기 데이터 정책" 정도로 보면 된다.
     */
}
