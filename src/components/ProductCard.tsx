import React, { useState } from 'react';
import { Product } from '../types';
import { formatCurrency } from '../utils';

interface ProductCardProps {
    product: Product;
    addToCart: (product: Product, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart }) => {
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        addToCart(product, quantity);
    };

    return (
        <div className="product-card">
            <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">{formatCurrency(product.priceINR)} / quintal</p>
                <p>{product.description}</p>
                <div className="quantity-selector">
                    <label htmlFor={`qty-${product.id}`}>Qty:</label>
                    <input
                        id={`qty-${product.id}`}
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    />
                </div>
                <button onClick={handleAddToCart} className="btn add-to-cart-btn">Add to Cart</button>
            </div>
        </div>
    );
};

export default ProductCard;
