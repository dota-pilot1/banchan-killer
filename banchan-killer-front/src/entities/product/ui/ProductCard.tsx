import { useState } from 'react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useCartStore } from '@/entities/cart/model/store';
import { PRODUCT_CATEGORY_LABELS, type Product } from '../model/types';

interface ProductCardProps {
    product: Product;
    onClick?: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const addItem = useCartStore((state) => state.addItem);

    const handleConfirmAddToCart = () => {
        addItem(product);
        setIsConfirmOpen(false);
    };

    return (
        <>
            <div 
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-xs transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer border border-slate-100/50"
                onClick={onClick}
            >
                {/* Image Section */}
                <div className="aspect-[4/3] overflow-hidden bg-slate-50">
                    <img 
                        src={product.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} 
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                {/* Content Section */}
                <div className="flex flex-1 flex-col p-5">
                    <div className="mb-2">
                        <span className="inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-indigo-600 uppercase">
                            {PRODUCT_CATEGORY_LABELS[product.category]}
                        </span>
                    </div>
                    
                    <h3 className="mb-1.5 text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {product.name}
                    </h3>
                    
                    <p className="mb-4 text-sm leading-relaxed text-slate-500 line-clamp-2 min-h-[40px]">
                        {product.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-400 line-through decoration-slate-300">
                                {(product.price * 1.2).toLocaleString()}원
                            </span>
                            <span className="text-xl font-extrabold text-slate-900">
                                {product.price.toLocaleString()}원
                            </span>
                        </div>
                        
                        <button 
                            className="rounded-full bg-slate-100 p-2.5 text-slate-600 transition-all hover:bg-slate-900 hover:text-white"
                            aria-label="장바구니 담기"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsConfirmOpen(true);
                            }}
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={isConfirmOpen}
                title="장바구니에 담을까요?"
                description={`${product.name}을(를) 장바구니에 추가합니다.`}
                confirmText="담기"
                cancelText="취소"
                onConfirm={handleConfirmAddToCart}
                onCancel={() => setIsConfirmOpen(false)}
            />
        </>
    );
};
