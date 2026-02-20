import React from 'react';
import { Order } from '../types';
import { formatCurrency } from '../utils';

interface OrderHistoryProps {
    orders: Order[];
    setPage: (page: string) => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders, setPage }) => {
    if (orders.length === 0) {
        return (
            <div className="page-container orders-container">
                <h1 className="page-title">Your Orders</h1>
                <div className="empty-orders">
                    <p>You have not placed any orders yet.</p>
                    <button className="btn" onClick={() => setPage('shop')}>Start Shopping</button>
                </div>
            </div>
        );
    }
    return (
        <div className="page-container orders-container">
            <h1 className="page-title">Your Orders</h1>
            <div className="orders-list">
                {orders.map(order => (
                    <div key={order.id} className="order-card">
                        <div className="order-header">
                            <div><strong>Order ID:</strong> {order.id}</div>
                            <div><strong>Date:</strong> {order.date}</div>
                            <div><strong>Total:</strong> {formatCurrency(order.total)}</div>
                        </div>
                        <div className="order-details">
                            <ul className="order-items-list">
                                {order.items.map(item => (
                                    <li key={item.id}>
                                        <span>{item.quantity} x {item.name}</span>
                                        <span>{formatCurrency(item.priceINR * item.quantity)}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="order-total">
                                <strong>Total Paid: {formatCurrency(order.total)}</strong>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistory;
