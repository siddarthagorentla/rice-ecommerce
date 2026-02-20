import React from 'react';

interface HeaderProps {
    page: string;
    setPage: (page: string) => void;
    cartCount: number;
}

const Header: React.FC<HeaderProps> = ({ page, setPage, cartCount }) => (
    <header className="app-header">
        <div className="logo" onClick={() => setPage('shop')}>MKRM Rice</div>
        <nav className="navigation">
            <a href="#" onClick={(e) => { e.preventDefault(); setPage('shop'); }} className={page === 'shop' ? 'active' : ''}>Shop</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setPage('trace'); }} className={page === 'trace' ? 'active' : ''}>Traceability</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setPage('estimate'); }} className={page === 'estimate' ? 'active' : ''}>Price Estimator</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setPage('convert'); }} className={page === 'convert' ? 'active' : ''}>Paddy Converter</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setPage('orders'); }} className={page === 'orders' ? 'active' : ''}>My Orders</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setPage('cart'); }} className={page === 'cart' ? 'active' : ''}>
                <span className="cart-indicator">
                    Cart {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </span>
            </a>
        </nav>
    </header>
);

export default Header;
