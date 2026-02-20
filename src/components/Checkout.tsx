import React, { useState } from 'react';
import { CartItem, CustomerDetails } from '../types';
import { formatCurrency } from '../utils';

interface CheckoutProps {
    placeOrder: (customerDetails: CustomerDetails) => void;
    cart: CartItem[];
}

const Checkout: React.FC<CheckoutProps> = ({ placeOrder, cart }) => {
    const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
        name: '', email: '', phone: '', address: '', city: '', state: '', zip: ''
    });

    const subtotal = cart.reduce((sum, item) => sum + item.priceINR * item.quantity, 0);
    const taxes = subtotal * 0.18;
    const total = subtotal + taxes;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        placeOrder(customerDetails);
    };

    if (cart.length === 0) {
        return <div className="page-container checkout-container"><p className="info-message">Your cart is empty. Please add items before checking out.</p></div>
    }

    return (
        <div className="page-container checkout-container">
            <h1 className="page-title">Checkout</h1>
            <div className="order-summary">
                <h3>Order Summary</h3>
                <ul>
                    {cart.map(item => (
                        <li key={item.id}>{item.quantity} x {item.name} - {formatCurrency(item.priceINR * item.quantity)}</li>
                    ))}
                </ul>
                <p>Subtotal: {formatCurrency(subtotal)}</p>
                <p>Taxes (18% GST): {formatCurrency(taxes)}</p>
                <p><strong>Total: {formatCurrency(total)}</strong></p>
            </div>
            <hr style={{ margin: '2rem 0' }} />
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="name" value={customerDetails.name} onChange={handleChange} placeholder="e.g., Ramesh Kumar" required />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={customerDetails.email} onChange={handleChange} placeholder="e.g., ramesh@example.com" required />
                </div>
                <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" name="phone" value={customerDetails.phone} onChange={handleChange} placeholder="e.g., 9876543210" required />
                </div>
                <div className="form-group">
                    <label>Address</label>
                    <input type="text" name="address" value={customerDetails.address} onChange={handleChange} placeholder="e.g., H.No. 123, Rice Mill Road" required />
                </div>
                <div className="form-group">
                    <label>City</label>
                    <input type="text" name="city" value={customerDetails.city} onChange={handleChange} placeholder="e.g., Kakinada" required />
                </div>
                <div className="form-group">
                    <label>State</label>
                    <input type="text" name="state" value={customerDetails.state} onChange={handleChange} placeholder="e.g., Andhra Pradesh" required />
                </div>
                <div className="form-group">
                    <label>ZIP Code</label>
                    <input type="text" name="zip" value={customerDetails.zip} onChange={handleChange} placeholder="e.g., 533001" required />
                </div>
                <button type="submit" className="btn">Place Order</button>
            </form>
        </div>
    );
};

export default Checkout;
