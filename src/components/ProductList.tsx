import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductListProps {
    products: Product[];
    addToCart: (product: Product, quantity: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, addToCart }) => {
    return (
        <div className="page-container">
            <h1 className="page-title">Our Premium Rice Selection</h1>
            <div className="product-grid">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} addToCart={addToCart} />
                ))}
            </div>
        </div>
    );
};

export default ProductList;
