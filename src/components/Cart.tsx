import React from 'react';
import { CartItem } from '../types';
import { formatCurrency } from '../utils';

interface CartProps {
    cart: CartItem[];
    updateCartQuantity: (productId: number, newQuantity: number) => void;
    setPage: (page: string) => void;
}

const Cart: React.FC<CartProps> = ({ cart, updateCartQuantity, setPage }) => {
    const total = cart.reduce((sum, item) => sum + item.priceINR * item.quantity, 0);

    if (cart.length === 0) {
        return (
            <div className="page-container cart-container">
                <h1 className="page-title">Your Cart</h1>
                <div className="empty-cart">
                    <p>Your cart is empty.</p>
                    <button className="btn" onClick={() => setPage('shop')}>Continue Shopping</button>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container cart-container">
            <h1 className="page-title">Your Cart</h1>
            <div className="cart-items">
                {cart.map(item => (
                    <div key={item.id} className="cart-item">
                        <div className="cart-item-details">
                            <span className="cart-item-info">{item.name}</span>
                            <span className="cart-item-price">{formatCurrency(item.priceINR * item.quantity)}</span>
                        </div>
                        <div className="cart-item-controls">
                            <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>+</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="cart-summary">
                <div className="cart-total">Total: {formatCurrency(total)}</div>
                <button className="btn" onClick={() => setPage('checkout')}>Proceed to Checkout</button>
            </div>
        </div>
    );
};

export default Cart;
