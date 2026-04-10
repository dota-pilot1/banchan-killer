export type ProductCategory = 
  | 'SIDE_DISH' 
  | 'SOUP_STEW' 
  | 'MAIN_COURSE' 
  | 'KIMCHI' 
  | 'SEASONAL';

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
    SIDE_DISH: '야채 반찬',
    SOUP_STEW: '국/찌개',
    MAIN_COURSE: '고기 반찬',
    KIMCHI: '김치류',
    SEASONAL: '야채 반찬',
};

export const CATEGORY_PAGE_CONFIG = {
    vegetable: {
        label: '야채 반찬',
        categories: ['SIDE_DISH'] as ProductCategory[],
        description: '매일 식탁에 올리기 좋은 기본 야채 반찬을 모았습니다.',
    },
    meat: {
        label: '고기 반찬',
        categories: ['MAIN_COURSE'] as ProductCategory[],
        description: '밥상에 든든함을 더해주는 매일 반찬용 고기 메뉴를 모았습니다.',
    },
    kimchi: {
        label: '김치류',
        categories: ['KIMCHI'] as ProductCategory[],
        description: '냉장고에 늘 두고 꺼내 먹기 좋은 기본 김치류를 담았습니다.',
    },
} as const;

export type CategoryPageSlug = keyof typeof CATEGORY_PAGE_CONFIG;

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    category: ProductCategory;
    imageUrl: string;
    status: 'SALE' | 'SOLDOUT' | 'HIDDEN';
}

export interface PaginatedProducts {
    content: Product[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}
