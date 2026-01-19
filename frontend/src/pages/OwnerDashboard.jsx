import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

export default function OwnerDashboard() {
    const [flats, setFlats] = useState([]);
    const [selectedFlat, setSelectedFlat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [fareForm, setFareForm] = useState({ rent: '', maintenance: '', cleaning: '', garbage: '' });

    useEffect(() => {
        fetchMyFlats();
    }, []);

    const fetchMyFlats = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/flats/my-flats');
            setFlats(response.data.data.flats || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch flats');
        }
        setLoading(false);
    };

    const handleSelectFlat = (flat) => {
        setSelectedFlat(flat);
        setFareForm({
            rent: flat.rent || '',
            maintenance: flat.defaultMaintenance || '',
            cleaning: flat.defaultCleaning || '',
            garbage: flat.defaultGarbage || '',
        });
    };

    const handleUpdateFare = async () => {
        try {
            const response = await apiClient.put(`/flats/my-flats/${selectedFlat._id}/fare`, {
                rent: parseFloat(fareForm.rent),
                defaultMaintenance: parseFloat(fareForm.maintenance),
                defaultCleaning: parseFloat(fareForm.cleaning),
                defaultGarbage: parseFloat(fareForm.garbage),
            });

            alert('Fare updated successfully!');
            setFlats(flats.map(f => f._id === selectedFlat._id ? response.data.data.flat : f));
            setSelectedFlat(response.data.data.flat);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update fare');
        }
    };

    if (loading) return <main className="container page"><div className="loading">Loading...</div></main>;

    const occupiedCount = flats.filter(f => f.status === 'occupied').length;
    const availableCount = flats.filter(f => f.status === 'available').length;
    const totalRent = flats.reduce((sum, f) => sum + (f.rent || 0), 0);

    return (
        <main className="container page">
            <div className="page-header">
                <h1 className="page-title">Owner Dashboard</h1>
                <p className="page-subtitle">Manage your properties, tenants, and fares with the same look as admin</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="stat-card">
                    <h3>{flats.length}</h3>
                    <p>Total Flats</p>
                </div>
                <div className="stat-card bg-gradient-to-br from-emerald-600 to-green-600">
                    <h3>{occupiedCount}</h3>
                    <p>Occupied</p>
                </div>
                <div className="stat-card bg-gradient-to-br from-amber-500 to-orange-600">
                    <h3>{availableCount}</h3>
                    <p>Available</p>
                </div>
                <div className="stat-card bg-gradient-to-br from-indigo-600 to-purple-600">
                    <h3>৳{totalRent}</h3>
                    <p>Total Monthly Rent</p>
                </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Flats List */}
                <div className="card border border-gray-200 dark:border-gray-700 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Flats</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Select a flat to manage details</p>
                        </div>
                        <span className="badge badge-info">{flats.length}</span>
                    </div>

                    {flats.length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-300">No flats registered</p>
                    ) : (
                        <div className="space-y-3">
                            {flats.map((flat) => (
                                <button
                                    key={flat._id}
                                    onClick={() => handleSelectFlat(flat)}
                                    className={`w-full text-left rounded-xl border transition-all duration-200 p-4 hover:-translate-y-0.5 hover:shadow-md ${selectedFlat?._id === flat._id
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-base font-semibold text-gray-900 dark:text-white">Flat {flat.flatNumber}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">{flat.buildingId?.name}</p>
                                        </div>
                                        {flat.currentTenant ? (
                                            <span className="badge badge-success">Occupied</span>
                                        ) : (
                                            <span className="badge badge-warning">Vacant</span>
                                        )}
                                    </div>
                                    <div className="mt-3 flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                                        <span>Rent: ৳{flat.rent}/month</span>
                                        <span className="font-semibold capitalize">{flat.status}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Flat Details & Fare Management */}
                <div className="lg:col-span-2 space-y-6">
                    {selectedFlat ? (
                        <>
                            <div className="card border border-gray-200 dark:border-gray-700 shadow-lg">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Flat {selectedFlat.flatNumber}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{selectedFlat.buildingId?.name}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="badge badge-info capitalize">{selectedFlat.flatType === 'bachelor' ? 'Bachelor' : 'Family'}</span>
                                        {selectedFlat.currentTenant ? (
                                            <span className="badge badge-success">Occupied</span>
                                        ) : (
                                            <span className="badge badge-warning">Vacant</span>
                                        )}
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                                    <div className="space-y-1">
                                        <p><strong>Bedrooms:</strong> {selectedFlat.bedrooms}</p>
                                        <p><strong>Bathrooms:</strong> {selectedFlat.bathrooms}</p>
                                        <p><strong>Area:</strong> {selectedFlat.area} sq ft</p>
                                        <p><strong>Floor:</strong> {selectedFlat.floor}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p><strong>Orientation:</strong> {selectedFlat.orientation}</p>
                                        <p><strong>Balconies:</strong> {selectedFlat.balconies}</p>
                                        <p><strong>Kitchens:</strong> {selectedFlat.kitchens}</p>
                                        <p><strong>Status:</strong> <span className="capitalize">{selectedFlat.status}</span></p>
                                    </div>
                                </div>

                                {/* Tenant Info */}
                                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Current Tenant</h4>
                                    {selectedFlat.currentTenant ? (
                                        <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-700 dark:text-gray-300">
                                            <p><strong>Name:</strong> {selectedFlat.currentTenant?.firstName} {selectedFlat.currentTenant?.lastName}</p>
                                            <p><strong>Email:</strong> {selectedFlat.currentTenant?.email}</p>
                                            <p><strong>Phone:</strong> {selectedFlat.currentTenant?.phone || 'N/A'}</p>
                                        </div>
                                    ) : (
                                        <div className="alert alert-warning">No tenant currently assigned</div>
                                    )}
                                </div>
                            </div>

                            <div className="card border border-gray-200 dark:border-gray-700 shadow-lg">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Update Fare & Fees</h4>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Rent (৳)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={fareForm.rent}
                                            onChange={(e) => setFareForm({ ...fareForm, rent: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Maintenance Fee (৳)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={fareForm.maintenance}
                                            onChange={(e) => setFareForm({ ...fareForm, maintenance: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cleaning Fee (৳)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={fareForm.cleaning}
                                            onChange={(e) => setFareForm({ ...fareForm, cleaning: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Garbage Fee (৳)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={fareForm.garbage}
                                            onChange={(e) => setFareForm({ ...fareForm, garbage: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <button className="btn btn-primary w-full mt-5" onClick={handleUpdateFare}>
                                    Update Fare Structure
                                </button>
                            </div>

                            {selectedFlat.amenities?.length > 0 && (
                                <div className="card border border-gray-200 dark:border-gray-700 shadow-lg">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Amenities</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedFlat.amenities.map((amenity, i) => (
                                            <span key={i} className="badge badge-info">{amenity}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="card border border-dashed border-gray-300 dark:border-gray-700 h-full flex items-center justify-center text-gray-600 dark:text-gray-300">
                            <p>Select a flat to view details and manage fare</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
