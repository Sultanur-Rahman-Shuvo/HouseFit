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
    const [budgetToAreaFilter, setBudgetToAreaFilter] = useState({ budget: '', bedrooms: '', location: '' });

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
            const budget = budgetToAreaFilter.budget || 50000;
            const bedrooms = budgetToAreaFilter.bedrooms || 2;
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
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl mb-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent dark:text-white">
                    Browse Available Flats
                </h1>
                <p className="text-gray-600 dark:text-gray-200 text-base">Find your perfect home with AI-powered suggestions</p>
            </div>

            <div className="card">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Search & Filter</h3>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                    <div>
                        <label className="text-sm text-gray-800 dark:text-gray-100">Budget (Max Rent)</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Max rent"
                            value={filters.maxRent}
                            onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-800 dark:text-gray-100">Bedrooms</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Bedrooms"
                            value={filters.bedrooms}
                            onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-800 dark:text-gray-100">Min Rent</label>
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
            </div>

            {/* Budget to Area Suggestion Section */}
            <div className="card" style={{ marginTop: '20px' }}>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Budget to Area Suggestion</h3>
                <p className="text-gray-600 dark:text-gray-200 mb-4 text-sm">Have a budget? Get area recommendations with AI insights!</p>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '15px' }}>
                    <div>
                        <label className="text-sm text-gray-800 dark:text-gray-100">Budget (Max Rent)</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="e.g., 50000"
                            value={budgetToAreaFilter.budget}
                            onChange={(e) => setBudgetToAreaFilter({ ...budgetToAreaFilter, budget: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-800 dark:text-gray-100">Bedrooms</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="e.g., 2"
                            value={budgetToAreaFilter.bedrooms}
                            onChange={(e) => setBudgetToAreaFilter({ ...budgetToAreaFilter, bedrooms: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-800 dark:text-gray-100">Location</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g., Dhaka"
                            value={budgetToAreaFilter.location}
                            onChange={(e) => setBudgetToAreaFilter({ ...budgetToAreaFilter, location: e.target.value })}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button
                            className="btn w-full"
                            onClick={getAreaSuggestion}
                            style={{
                                padding: '12px 20px',
                                fontSize: '14px',
                                fontWeight: '600',
                                background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                            }}
                        >
                            Get Area Suggestion
                        </button>
                    </div>
                </div>

                {areaSuggestion && (
                    <div className="mt-4 p-5 rounded-xl border border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400">
                        <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">Recommended Area</h4>
                        <div className="grid gap-2 text-gray-900 dark:text-gray-100 text-sm">
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
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Area to Budget Suggestion</h3>
                <p className="text-gray-600 dark:text-gray-200 mb-4 text-sm">Know your desired flat specifications? Get budget recommendations!</p>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '15px' }}>
                    <div>
                        <label className="text-sm text-gray-800 dark:text-gray-100">Area (sqft)</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="e.g., 1200"
                            value={areaSpecFilter.area}
                            onChange={(e) => setAreaSpecFilter({ ...areaSpecFilter, area: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-800 dark:text-gray-100">Bedrooms</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="e.g., 3"
                            value={areaSpecFilter.bedrooms}
                            onChange={(e) => setAreaSpecFilter({ ...areaSpecFilter, bedrooms: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-800 dark:text-gray-100">Bathrooms</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="e.g., 2"
                            value={areaSpecFilter.bathrooms}
                            onChange={(e) => setAreaSpecFilter({ ...areaSpecFilter, bathrooms: e.target.value })}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button
                            className="btn w-full"
                            onClick={getBudgetSuggestion}
                            style={{
                                padding: '12px 20px',
                                fontSize: '14px',
                                fontWeight: '600',
                                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                            }}
                        >
                            Get Budget Suggestion
                        </button>
                    </div>
                </div>

                {budgetSuggestion && (
                    <div className="mt-4 p-5 rounded-xl border border-green-500 bg-green-50 dark:bg-emerald-900/30 dark:border-green-400">
                        <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">Suggested Budget</h4>
                        <div className="grid gap-2 text-gray-900 dark:text-gray-100 text-sm">
                            <p className="text-2xl font-bold text-green-700 dark:text-green-200">{budgetSuggestion.suggestedBudget} BDT/month</p>
                            <p><strong>Range:</strong> {budgetSuggestion.budgetRange?.min} - {budgetSuggestion.budgetRange?.max} BDT</p>
                            <p><strong>Confidence:</strong> <span className="badge badge-success">{budgetSuggestion.confidence}</span></p>
                            <p><strong>Market Comparison:</strong> {budgetSuggestion.marketComparison}</p>
                            <p><strong>Rationale:</strong> {budgetSuggestion.rationale}</p>
                            {budgetSuggestion.tips?.length > 0 && (
                                <div className="mt-2 p-3 rounded-lg bg-white/60 dark:bg-gray-800/60">
                                    <strong className="block mb-2">Tips:</strong>
                                    <ul className="list-disc list-inside space-y-1">
                                        {budgetSuggestion.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {error && <div className="alert alert-error" style={{ marginTop: '15px' }}>{error}</div>}

            {loading ? (
                <p className="text-gray-700 dark:text-gray-100">Loading flats...</p>
            ) : flats.length === 0 ? (
                <p className="text-gray-700 dark:text-gray-100">No flats available matching your criteria</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {flats.map((flat) => (
                        <div
                            key={flat._id}
                            className="card p-5 relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/95 dark:bg-gray-900/90"
                        >
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

                            <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700 flex items-start justify-between gap-3">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Flat {flat.flatNumber}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-200">{flat.buildingId?.name}</p>
                                </div>
                                <span className={flat.flatType === 'bachelor' ? 'badge badge-info' : 'badge badge-success'}>
                                    {flat.flatType === 'bachelor' ? 'Bachelor' : 'Family'}
                                </span>
                            </div>

                            <div className="my-3 grid gap-2 text-sm text-gray-700 dark:text-gray-200">
                                <p className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Beds / Baths</span> <span className="font-semibold">{flat.bedrooms} / {flat.bathrooms}</span></p>
                                <p className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Area</span> <span className="font-semibold">{flat.area} sq ft</span></p>
                                <p className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Orientation</span> <span className="font-semibold">{flat.orientation || 'East'}</span></p>
                            </div>

                            <p className="inline-flex items-center gap-2 text-lg font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-lg mb-4">
                                ৳{flat.rent}/month
                            </p>

                            <button
                                className="btn btn-primary w-full mb-2"
                                onClick={() => handleViewFlat(flat._id)}
                            >
                                View Details & Price Prediction
                            </button>

                            <button
                                className="btn btn-secondary w-full"
                                onClick={() => handleBooking(flat._id)}
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
