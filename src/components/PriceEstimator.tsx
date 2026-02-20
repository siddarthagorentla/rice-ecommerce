import React, { useState } from 'react';
import { AnalyticsService, formatCurrency } from '../utils';

const PriceEstimatorService = (() => {
    const estimatePrice = async (riceType: string, quantity: number, region: string, season: string) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5006';
            const response = await fetch(`${API_URL}/api/estimate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ riceType, quantity, region, season })
            });
            if (!response.ok) throw new Error('Failed to fetch estimate');
            return await response.json();
        } catch (error) {
            console.error("Error estimating price:", error);
            return {
                estimatedPriceINR: 0,
                pricePerQuintal: 0,
                reason: 'Error connecting to pricing service. Please ensure backend is running.'
            };
        }
    };
    return { estimatePrice };
})();

const PriceEstimator: React.FC = () => {
    const [formData, setFormData] = useState({
        riceType: 'Sona Masoori Rice',
        quantity: 100,
        region: 'Kakinada',
        season: 'Kharif',
    });
    const [result, setResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setResult(null);
        try {
            const estimatedPrice = await PriceEstimatorService.estimatePrice(formData.riceType, formData.quantity, formData.region, formData.season);
            setResult(estimatedPrice);
            AnalyticsService.sendEvent({ type: 'PRICE_ESTIMATION', formData, result: 'success' });
        } catch (err: any) {
            setError('Failed to get an estimate. Please try again later.');
            AnalyticsService.sendEvent({ type: 'PRICE_ESTIMATION', formData, result: 'error', error: err.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-container estimator-container">
            <h1 className="page-title">Wholesale Price Estimator</h1>
            <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Get a real-time price estimate for bulk rice orders powered by our AI model.</p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="riceType">Rice Variety</label>
                    <select id="riceType" name="riceType" value={formData.riceType} onChange={handleChange} required>
                        <option>Sona Masoori Rice</option>
                        <option>Broken White Rice</option>
                        <option>Jai Sri Ram Premium Rice</option>
                        <option>Extra-Long Grain Basmati</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Quantity (in Quintals)</label>
                    <input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} min="1" required />
                </div>
                <div className="form-group">
                    <label htmlFor="region">Region</label>
                    <select id="region" name="region" value={formData.region} onChange={handleChange} required>
                        <option>Chattisgarh</option>
                        <option>Kakinada</option>
                        <option>Miryalaguda</option>
                        <option>Warangal</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="season">Season</label>
                    <select id="season" name="season" value={formData.season} onChange={handleChange} required>
                        <option>Kharif (Monsoon)</option>
                        <option>Rabi (Winter)</option>
                    </select>
                </div>
                <button type="submit" className="btn" disabled={isLoading}>{isLoading ? 'Estimating...' : 'Get Estimate'}</button>
            </form>
            {error && <p className="error-message">{error}</p>}
            {result && (
                <div className="estimator-result">
                    <h3>Estimated Wholesale Price</h3>
                    <div className="estimated-price">
                        <span>{formatCurrency(result.estimatedPriceINR)}</span> for {formData.quantity} Quintals
                    </div>
                    <p className="price-details">
                        Approx. <strong>{formatCurrency(result.pricePerQuintal)}</strong> per quintal
                    </p>
                    <p className="reason"><strong>Justification:</strong> {result.reason}</p>
                    <button className="btn btn-secondary" onClick={() => alert('This would lead to a B2B order portal.')}>Place Wholesale Order</button>
                </div>
            )}
        </div>
    );
};

export default PriceEstimator;
