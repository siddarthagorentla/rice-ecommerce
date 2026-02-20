import React, { useState, useEffect } from 'react';
import { AnalyticsService, formatCurrency } from '../utils';

const PaddyConverter: React.FC = () => {
    const [paddyAmount, setPaddyAmount] = useState(100);
    const [result, setResult] = useState<any>(null);

    const calculate = (amount: number) => {
        const rawRiceYield = amount * 0.68; // 68% yield
        const brokenRiceYield = amount * 0.05; // 5% by-product
        const rawRiceValue = rawRiceYield * (4500 / 100); // Avg. Rs 45/kg
        const brokenRiceValue = brokenRiceYield * (2500 / 100); // Avg. Rs 25/kg

        setResult({
            rawRice: { yield: rawRiceYield, value: rawRiceValue },
            brokenRice: { yield: brokenRiceYield, value: brokenRiceValue },
            totalValue: rawRiceValue + brokenRiceValue
        });
        AnalyticsService.sendEvent({ type: 'PADDY_CONVERSION_CALCULATION', paddyAmount: amount });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        calculate(paddyAmount);
    };

    useEffect(() => {
        calculate(paddyAmount);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="page-container converter-container">
            <div className="page-title-container">
                <h1 className="page-title">Paddy to Rice Converter</h1>
                <button className="btn btn-secondary" onClick={() => alert('This leads to a portal for farmers.')}>Farmer's Portal</button>
            </div>

            <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Calculate the estimated yield and market value from raw paddy to finished rice products.</p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="paddyAmount">Amount of Raw Paddy (in Quintals)</label>
                    <input type="number" id="paddyAmount" value={paddyAmount} onChange={e => setPaddyAmount(parseFloat(e.target.value))} min="1" required />
                </div>
                <button type="submit" className="btn">Calculate Yield</button>
            </form>
            {result && (
                <div className="converter-result">
                    <h2>Estimated Yield for {paddyAmount} Quintals of Paddy</h2>
                    <div className="result-grid">
                        <div className="result-card">
                            <h3>Raw Rice Yield</h3>
                            <p className="yield-amount">{result.rawRice.yield.toFixed(2)} Qtl</p>
                            <p className="market-rate">@ ~{formatCurrency(4500)}/Qtl</p>
                            <p className="total-value">{formatCurrency(result.rawRice.value)}</p>
                        </div>
                        <div className="result-card">
                            <h3>Broken Rice Yield</h3>
                            <p className="yield-amount">{result.brokenRice.yield.toFixed(2)} Qtl</p>
                            <p className="market-rate">@ ~{formatCurrency(2500)}/Qtl</p>
                            <p className="total-value">{formatCurrency(result.brokenRice.value)}</p>
                        </div>
                    </div>
                    <div className="result-summary">
                        <h3>Total Estimated Market Value</h3>
                        <p className="total-value-amount">{formatCurrency(result.totalValue)}</p>
                    </div>
                    <p className="disclaimer">* Disclaimer: These calculations are estimates based on average yields (68% raw, 5% broken) and current market rates. Actual values may vary.</p>
                </div>
            )}
        </div>
    );
};

export default PaddyConverter;
