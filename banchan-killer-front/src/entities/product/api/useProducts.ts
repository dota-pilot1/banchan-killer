import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { PaginatedProducts, ProductCategory } from '../model/types';

interface GetProductsParams {
    page?: number;
    size?: number;
    category?: ProductCategory;
}

export const useProducts = ({ page = 0, size = 20, category }: GetProductsParams = {}) => {
    return useQuery<PaginatedProducts>({
        queryKey: ['products', { page, size, category }],
        queryFn: async () => {
            const params: any = { page, size };
            if (category) params.category = category;
            
            const { data } = await axios.get('/api/products', { params });
            return data;
        },
    });
};

export const useProduct = (id: number) => {
    return useQuery({
        queryKey: ['products', id],
        queryFn: async () => {
            const { data } = await axios.get(`/api/products/${id}`);
            return data;
        },
    });
};
