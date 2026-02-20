import React, { useState } from 'react';
import { TraceabilityRecord } from '../types';
import { AnalyticsService } from '../utils';

const Traceability: React.FC = () => {
    const [batchId, setBatchId] = useState('');
    const [result, setResult] = useState<TraceabilityRecord | null>(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setResult(null);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5006';
            const response = await fetch(`${API_URL}/api/trace/${batchId.trim()}`);
            if (response.ok) {
                const data = await response.json();
                setResult(data);
                AnalyticsService.sendEvent({ type: 'TRACEABILITY_SEARCH', batchId: batchId.trim(), result: 'found' });
            } else {
                setError('Batch ID not found. Please check the ID and try again.');
                AnalyticsService.sendEvent({ type: 'TRACEABILITY_SEARCH', batchId: batchId.trim(), result: 'not_found' });
            }
        } catch (err) {
            setError('Error connecting to server.');
        }
    };

    return (
        <div className="page-container trace-container">
            <h1 className="page-title">Product Traceability</h1>
            <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Enter the Batch ID found on your MKRM Rice packaging to trace its journey from farm to you. Try: <strong>MKRM-SonaMasoori23-2024-Chattisgarh8</strong></p>
            <form className="trace-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="trace-input"
                    value={batchId}
                    onChange={(e) => setBatchId(e.target.value)}
                    placeholder="Enter Batch ID (e.g., MKRM-SonaMasoori23-2024-Chattisgarh8)"
                    aria-label="Batch ID"
                />
                <button type="submit" className="btn">Trace</button>
            </form>
            {error && <p className="error-message">{error}</p>}
            {result && <TraceabilityResult result={result} />}
        </div>
    );
};

const TraceabilityResult: React.FC<{ result: TraceabilityRecord }> = ({ result }) => {
    const timelineItems = [
        {
            icon: '🌾', title: 'Farming & Harvest', details: [
                { label: 'Farm Name', value: result.farm.name },
                { label: 'Harvest Date', value: result.farm.harvestDate },
            ], map: result.farm.mapEmbedUrl
        },
        {
            icon: '🏭', title: 'Milling & Processing', details: [
                { label: 'Milling Date', value: result.milling.date },
                { label: 'Processing Facility', value: result.milling.facility },
            ]
        },
        {
            icon: '🚚', title: 'Logistics', details: [
                { label: 'Transport Mode', value: result.logistics.mode },
                { label: 'Departure from Mill', value: result.logistics.departure },
                { label: 'Arrival at Warehouse', value: result.logistics.arrival },
            ]
        },
        {
            icon: '📦', title: 'Packaging & Storage', details: [
                { label: 'Packaging Date', value: result.packagingAndStorage.packagingDate },
                { label: 'Packaging Material', value: result.packagingAndStorage.material },
                { label: 'Storage Warehouse', value: result.packagingAndStorage.warehouse },
                { label: 'Storage Conditions', value: result.packagingAndStorage.conditions },
            ]
        },
        {
            icon: '🔬', title: 'Quality Assurance', details: [
                { label: 'Moisture Content', value: result.quality.moisture },
                { label: 'Broken Grains', value: result.quality.brokenGrains },
                { label: 'Purity Level', value: result.quality.purity },
                { label: 'Avg. Grain Length', value: result.quality.avgGrainLength },
                { label: 'Grade', value: result.quality.grade },
                { label: 'Tested By', value: result.quality.testedBy },
            ]
        },
        {
            icon: '📜', title: 'Certifications', details: [
                { label: 'Certification Body', value: result.certifications },
            ]
        }
    ];

    return (
        <div className="trace-results">
            <h2 style={{ textAlign: 'center' }}>{result.productName}</h2>
            <h3 style={{ textAlign: 'center' }}>Batch ID: {result.batchId}</h3>
            <div className="timeline">
                {timelineItems.map((item, index) => (
                    <div key={index} className="timeline-item">
                        <h4><span className="timeline-icon" aria-hidden="true">{item.icon}</span> {item.title}</h4>
                        {item.details.map((detail, i) => (
                            <p key={i}><strong>{detail.label}:</strong> {detail.value}</p>
                        ))}
                        {item.map && (
                            <div className="map-container">
                                <iframe
                                    src={item.map}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title={`Map of ${result.farm.name}`}
                                ></iframe>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Traceability;
