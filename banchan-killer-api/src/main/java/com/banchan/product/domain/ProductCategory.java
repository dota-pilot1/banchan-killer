package com.banchan.product.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ProductCategory {
    SIDE_DISH("밑반찬"),
    SOUP_STEW("국/찌개"),
    MAIN_COURSE("메인 요리"),
    KIMCHI("김치"),
    SEASONAL("제철 반찬");

    private final String description;
}
