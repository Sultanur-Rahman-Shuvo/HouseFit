import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useAuth } from '../hooks/useAuth';

export default function VisitorDashboard() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [flats, setFlats] = useState([]);
    const [filters, setFilters] = useState({ buildingId: '', minRent: '', maxRent: '', flatType: '', bedrooms: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [areaSuggestion, setAreaSuggestion] = useState(null);
    const [budgetSuggestion, setBudgetSuggestion] = useState(null);
    const [areaSpecFilter, setAreaSpecFilter] = useState({ area: '', bedrooms: '', bathrooms: '', location: '' });

    useEffect(() => {
        fetchFlats();
    }, []);

    const fetchFlats = async (params = {}) => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();
            queryParams.append('status', 'available');
            if (params.buildingId) queryParams.append('buildingId', params.buildingId);
            if (params.minRent) queryParams.append('minRent', params.minRent);
            if (params.maxRent) queryParams.append('maxRent', params.maxRent);

            const response = await apiClient.get(`/flats?${queryParams.toString()}`);
            setFlats(response.data.data.flats || []);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch flats');
        } finally {
            setLoading(false);
        }
    };

    const handleApplyFilters = () => {
        fetchFlats({
            buildingId: filters.buildingId,
            minRent: filters.minRent,
            maxRent: filters.maxRent,
        });
    };

    const getAreaSuggestion = async () => {
        try {
            const budget = filters.maxRent || 50000;
            const bedrooms = filters.bedrooms || 2;
            const response = await apiClient.post('/predict/area-suggestion', { budget, bedrooms });
            setAreaSuggestion(response.data.data.suggestion);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to get suggestion. Make sure Ollama is running.';
            alert(errorMsg);
        }
    };

    const getBudgetSuggestion = async () => {
        try {
            const area = areaSpecFilter.area || 1200;
            const bedrooms = areaSpecFilter.bedrooms || 3;
            const bathrooms = areaSpecFilter.bathrooms || 2;
            const location = areaSpecFilter.location || 'Dhaka';
            const response = await apiClient.post('/predict/budget-from-area', {
                area,
                bedrooms,
                bathrooms,
                location,
            });
            setBudgetSuggestion(response.data.data.budget);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to get budget suggestion. Make sure Ollama is running.';
            alert(errorMsg);
        }
    };

    const handleViewFlat = (flatId) => {
        navigate(`/flat/${flatId}`);
    };

    const handleBooking = (flatId) => {
        if (!isAuthenticated) {
            alert('Please login to book a flat');
            navigate('/login');
            return;
        }
        navigate(`/flat/${flatId}`);
    };

    return (
        <main className="container" style={{ paddingTop: '20px' }}>
            <div style={{
                background: 'white',
                padding: '32px',
                borderRadius: '16px',
                marginBottom: '24px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    marginBottom: '8px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>Browse Available Flats</h1>
                <p style={{ color: '#6b7280', fontSize: '16px' }}>Find your perfect home with AI-powered suggestions</p>
            </div>

            <div className="card">
                <h3>Search & Filter</h3>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                    <div>
                        <label>Budget (Max Rent)</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Max rent"
                            value={filters.maxRent}
                            onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Bedrooms</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Bedrooms"
                            value={filters.bedrooms}
                            onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Min Rent</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Min rent"
                            value={filters.minRent}
                            onChange={(e) => setFilters({ ...filters, minRent: e.target.value })}
                        />
                    </div>
                    <div style={{ paddingTop: '25px' }}>
                        <button className="btn btn-primary" onClick={handleApplyFilters}>Apply Filters</button>
                    </div>
                </div>

                <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button className="btn btn-secondary" onClick={getAreaSuggestion} style={{
                        padding: '14px 24px',
                        fontSize: '15px',
                        fontWeight: '600'
                    }}>
                        Budget → Area Suggestion
                    </button>
                    <button className="btn btn-secondary" onClick={() => document.getElementById('areaToBudgetSection').scrollIntoView({ behavior: 'smooth' })} style={{
                        padding: '14px 24px',
                        fontSize: '15px',
                        fontWeight: '600'
                    }}>
                        Area → Budget Suggestion
                    </button>
                </div>

                {areaSuggestion && (
                    <div style={{
                        marginTop: '15px',
                        padding: '20px',
                        background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
                        border: '2px solid #3b82f6',
                        borderRadius: '12px'
                    }}>
                        <h4 style={{ color: '#1e40af', marginBottom: '12px', fontWeight: '700' }}>Recommended Area</h4>
                        <div style={{ display: 'grid', gap: '8px', color: '#1f2937' }}>
                            <p><strong>Area:</strong> {areaSuggestion.recommendedArea} sqft</p>
                            <p><strong>Range:</strong> {areaSuggestion.areaRange?.min} - {areaSuggestion.areaRange?.max} sqft</p>
                            <p><strong>Feasibility:</strong> <span className="badge badge-success">{areaSuggestion.feasibility}</span></p>
                            {areaSuggestion.alternativeLocations?.length > 0 && (
                                <p><strong>Alternative Locations:</strong> {areaSuggestion.alternativeLocations.join(', ')}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div id="areaToBudgetSection" className="card" style={{ marginTop: '20px' }}>
                <h3 style={{ fontWeight: '700', marginBottom: '8px' }}>Area to Budget Suggestion</h3>
                <p style={{ color: '#6b7280', marginBottom: '16px' }}>Know your desired flat specifications? Get budget recommendations!</p>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '15px' }}>
                    <div>
                        <label>Area (sqft)</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="e.g., 1200"
                            value={areaSpecFilter.area}
                            onChange={(e) => setAreaSpecFilter({ ...areaSpecFilter, area: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Bedrooms</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="e.g., 3"
                            value={areaSpecFilter.bedrooms}
                            onChange={(e) => setAreaSpecFilter({ ...areaSpecFilter, bedrooms: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Bathrooms</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="e.g., 2"
                            value={areaSpecFilter.bathrooms}
                            onChange={(e) => setAreaSpecFilter({ ...areaSpecFilter, bathrooms: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Location</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g., Dhanmondi"
                            value={areaSpecFilter.location}
                            onChange={(e) => setAreaSpecFilter({ ...areaSpecFilter, location: e.target.value })}
                        />
                    </div>
                </div>
                <button className="btn btn-primary" onClick={getBudgetSuggestion} style={{ width: '100%', padding: '14px', fontSize: '15px', fontWeight: '600' }}>
                    Get Budget Suggestion
                </button>

                {budgetSuggestion && (
                    <div style={{
                        marginTop: '15px',
                        padding: '20px',
                        background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                        border: '2px solid #059669',
                        borderRadius: '12px'
                    }}>
                        <h4 style={{ color: '#065f46', marginBottom: '12px', fontWeight: '700' }}>Suggested Budget</h4>
                        <div style={{ display: 'grid', gap: '8px', color: '#1f2937' }}>
                            <p style={{ fontSize: '24px', fontWeight: '700', color: '#059669' }}>{budgetSuggestion.suggestedBudget} BDT/month</p>
                            <p><strong>Range:</strong> {budgetSuggestion.budgetRange?.min} - {budgetSuggestion.budgetRange?.max} BDT</p>
                            <p><strong>Confidence:</strong> <span className="badge badge-success">{budgetSuggestion.confidence}</span></p>
                            <p><strong>Market Comparison:</strong> {budgetSuggestion.marketComparison}</p>
                            <p><strong>Rationale:</strong> {budgetSuggestion.rationale}</p>
                            {budgetSuggestion.tips?.length > 0 && (
                                <div style={{ marginTop: '10px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '8px' }}>
                                    <strong style={{ display: 'block', marginBottom: '8px' }}>Tips:</strong>
                                    <ul style={{ marginLeft: '20px' }}>
                                        {budgetSuggestion.tips.map((tip, i) => <li key={i} style={{ marginBottom: '4px' }}>{tip}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {error && <div className="alert alert-error" style={{ marginTop: '15px' }}>{error}</div>}

            {loading ? (
                <p>Loading flats...</p>
            ) : flats.length === 0 ? (
                <p>No flats available matching your criteria</p>
            ) : (
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', marginTop: '20px' }}>
                    {flats.map((flat) => (
                        <div key={flat._id} className="card" style={{ padding: '20px' }}>
                            <div style={{ marginBottom: '16px', borderBottom: '2px solid #f3f4f6', paddingBottom: '12px' }}>
                                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>Flat {flat.flatNumber}</h3>
                                <p className="text-muted" style={{ fontSize: '14px' }}>{flat.buildingId?.name}</p>
                            </div>

                            <div style={{ margin: '16px 0', display: 'grid', gap: '8px' }}>
                                <span className={flat.flatType === 'bachelor' ? 'badge badge-info' : 'badge badge-success'}>
                                    {flat.flatType === 'bachelor' ? 'Bachelor' : 'Family'}
                                </span>
                                <p style={{ color: '#4b5563', fontSize: '14px' }}>
                                    <strong>Beds:</strong> {flat.bedrooms} | <strong>Baths:</strong> {flat.bathrooms}
                                </p>
                                <p style={{ color: '#4b5563', fontSize: '14px' }}>
                                    <strong>Area:</strong> {flat.area} sq ft | <strong>Floor:</strong> {flat.orientation || 'East'}
                                </p>
                            </div>

                            <p style={{ fontSize: '24px', fontWeight: '700', color: '#2563eb', marginBottom: '16px' }}>
                                ৳{flat.rent}/month
                            </p>

                            <button
                                className="btn btn-primary"
                                onClick={() => handleViewFlat(flat._id)}
                                style={{ width: '100%', marginBottom: '8px' }}
                            >
                                View Details & Price Prediction
                            </button>

                            <button
                                className="btn btn-secondary"
                                onClick={() => handleBooking(flat._id)}
                                style={{ width: '100%' }}
                            >
                                {isAuthenticated ? 'Book Now' : 'Login to Book'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
