import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import Traceability from './components/Traceability';
import PriceEstimator from './components/PriceEstimator';
import PaddyConverter from './components/PaddyConverter';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderHistory from './components/OrderHistory';
import Chatbot from './components/Chatbot';
import { PRODUCTS, EmailService } from './services';
import { AnalyticsService } from './utils';
import { Product, CartItem, Order, CustomerDetails } from './types';

const App: React.FC = () => {
    const [page, setPage] = useState('shop');
    const [cart, setCart] = useState<CartItem[]>(() => {
        try {
            const saved = localStorage.getItem('mkrm_cart');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });
    const [orders, setOrders] = useState<Order[]>(() => {
        try {
            const saved = localStorage.getItem('mkrm_orders');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    useEffect(() => {
        localStorage.setItem('mkrm_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('mkrm_orders', JSON.stringify(orders));
    }, [orders]);

    const addToCart = (product: Product, quantity: number) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...prevCart, { ...product, quantity }];
        });
        AnalyticsService.sendEvent({ type: 'ADD_TO_CART', productId: product.id, quantity: quantity, productName: product.name });
    };

    const updateCartQuantity = (productId: number, newQuantity: number) => {
        setCart(prevCart => {
            if (newQuantity <= 0) {
                return prevCart.filter(item => item.id !== productId);
            }
            return prevCart.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            );
        });
    };

    const placeOrder = async (customerDetails: CustomerDetails) => {
        const subtotal = cart.reduce((sum, item) => sum + item.priceINR * item.quantity, 0);
        const taxes = subtotal * 0.18;
        const total = subtotal + taxes;

        const newOrder: Order = {
            id: `MKRM-${Date.now()}`,
            date: new Date().toLocaleDateString('en-GB'),
            items: cart,
            subtotal,
            taxes,
            total,
            shippingDetails: customerDetails
        };

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5006';
            const response = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOrder)
            });

            if (!response.ok) {
                console.error('Failed to save order to the server database');
            }
        } catch (error) {
            console.error('Error saving order to server database:', error);
        }

        setOrders(prevOrders => [newOrder, ...prevOrders]);
        setCart([]);
        EmailService.sendOrderConfirmation(customerDetails, newOrder);
        AnalyticsService.sendEvent({ type: 'ORDER_PLACED', orderId: newOrder.id, total: total });
        setPage('orders');
    };

    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <>
            <Header page={page} setPage={setPage} cartCount={cartCount} />
            <main>
                {page === 'shop' && <ProductList products={PRODUCTS} addToCart={addToCart} />}
                {page === 'trace' && <Traceability />}
                {page === 'estimate' && <PriceEstimator />}
                {page === 'convert' && <PaddyConverter />}
                {page === 'cart' && <Cart cart={cart} updateCartQuantity={updateCartQuantity} setPage={setPage} />}
                {page === 'checkout' && <Checkout placeOrder={placeOrder} cart={cart} />}
                {page === 'orders' && <OrderHistory orders={orders} setPage={setPage} />}
            </main>
            <Chatbot products={PRODUCTS} />
            <Footer setPage={setPage} />
        </>
    );
};

export default App;
