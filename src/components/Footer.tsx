import React from 'react';

interface FooterProps {
    setPage: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ setPage }) => (
    <footer className="app-footer">
        <div className="footer-content">
            <p><strong>MKRM Rice</strong> is committed to delivering the highest quality rice, sourced responsibly from the finest fields in India. Our advanced traceability system ensures transparency and trust from farm to table.</p>
            <div className="footer-links">
                <a href="#" onClick={(e) => { e.preventDefault(); setPage('shop'); }}>Shop</a>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('About Us page coming soon!'); }}>About Us</a>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Contact page coming soon!'); }}>Contact</a>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Privacy Policy page coming soon!'); }}>Privacy Policy</a>
            </div>
        </div>
        <div className="footer-bottom">
            &copy; {new Date().getFullYear()} MKRM Rice Industries. All Rights Reserved.
        </div>
    </footer>
);

export default Footer;
