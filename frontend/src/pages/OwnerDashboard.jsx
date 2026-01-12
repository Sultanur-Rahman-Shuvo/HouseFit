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

    if (loading) return <main className="container"><p>Loading...</p></main>;

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
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>My Properties</h1>
                <p style={{ color: '#6b7280', fontSize: '16px' }}>Owner Dashboard</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
                {/* Flats List */}
                <div className="card">
                    <h3>My Flats</h3>
                    {flats.length === 0 ? (
                        <p>No flats registered</p>
                    ) : (
                        <div>
                            {flats.map((flat) => (
                                <div
                                    key={flat._id}
                                    className="card"
                                    onClick={() => handleSelectFlat(flat)}
                                    style={{
                                        cursor: 'pointer',
                                        marginBottom: '10px',
                                        padding: '10px',
                                        border: selectedFlat?._id === flat._id ? '2px solid #007bff' : '1px solid #ddd',
                                        backgroundColor: selectedFlat?._id === flat._id ? '#f0f8ff' : 'white',
                                    }}
                                >
                                    <h4>Flat {flat.flatNumber}</h4>
                                    <p>{flat.buildingId?.name}</p>
                                    <p><strong>Rent:</strong> ৳{flat.rent}/month</p>
                                    <p><strong>Status:</strong> {flat.status}</p>
                                    <p>
                                        {flat.currentTenant ? (
                                            <span className="badge badge-success">Occupied</span>
                                        ) : (
                                            <span className="badge badge-warning">Vacant</span>
                                        )}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Flat Details & Fare Management */}
                {selectedFlat ? (
                    <div className="card">
                        <h3>Flat {selectedFlat.flatNumber} - Details & Fare</h3>

                        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                            {/* Details */}
                            <div>
                                <h4 style={{ fontWeight: '700', marginBottom: '12px' }}>Flat Details</h4>
                                <p><strong>Type:</strong> {selectedFlat.flatType === 'bachelor' ? 'Bachelor' : 'Family'}</p>
                                <p><strong>Bedrooms:</strong> {selectedFlat.bedrooms}</p>
                                <p><strong>Bathrooms:</strong> {selectedFlat.bathrooms}</p>
                                <p><strong>Area:</strong> {selectedFlat.area} sq ft</p>
                                <p><strong>Floor:</strong> {selectedFlat.floor}</p>
                                <p><strong>Orientation:</strong> {selectedFlat.orientation}</p>
                                <p><strong>Balconies:</strong> {selectedFlat.balconies}</p>
                                <p><strong>Kitchens:</strong> {selectedFlat.kitchens}</p>
                                <p><strong>Status:</strong> {selectedFlat.status}</p>
                            </div>

                            {/* Tenant Info */}
                            <div>
                                <h4 style={{ fontWeight: '700', marginBottom: '12px' }}>Current Tenant</h4>
                                {selectedFlat.currentTenant ? (
                                    <>
                                        <p><strong>Name:</strong> {selectedFlat.currentTenant?.firstName} {selectedFlat.currentTenant?.lastName}</p>
                                        <p><strong>Email:</strong> {selectedFlat.currentTenant?.email}</p>
                                        <p><strong>Phone:</strong> {selectedFlat.currentTenant?.phone || 'N/A'}</p>
                                        <div className="alert alert-success" style={{ marginTop: '15px' }}>
                                            Flat is occupied
                                        </div>
                                    </>
                                ) : (
                                    <div className="alert alert-warning">
                                        No tenant currently assigned
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Fare Management */}
                        <div style={{ marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
                            <h4 style={{ fontWeight: '700', marginBottom: '12px' }}>Update Fare & Fees</h4>
                            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                                <div>
                                    <label>Monthly Rent (৳)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={fareForm.rent}
                                        onChange={(e) => setFareForm({ ...fareForm, rent: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label>Maintenance Fee (৳)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={fareForm.maintenance}
                                        onChange={(e) => setFareForm({ ...fareForm, maintenance: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label>Cleaning Fee (৳)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={fareForm.cleaning}
                                        onChange={(e) => setFareForm({ ...fareForm, cleaning: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label>Garbage Fee (৳)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={fareForm.garbage}
                                        onChange={(e) => setFareForm({ ...fareForm, garbage: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button className="btn btn-primary" onClick={handleUpdateFare} style={{ marginTop: '15px', width: '100%' }}>
                                Update Fare Structure
                            </button>
                        </div>

                        {/* Amenities */}
                        {selectedFlat.amenities?.length > 0 && (
                            <div style={{ marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
                                <h4 style={{ fontWeight: '700', marginBottom: '12px' }}>Amenities</h4>
                                <ul>
                                    {selectedFlat.amenities.map((amenity, i) => <li key={i}>{amenity}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="card">
                        <p className="text-muted">Select a flat to view details and manage fare</p>
                    </div>
                )}
            </div>

            <div className="card" style={{ marginTop: '20px' }}>
                <h3 style={{ fontWeight: '700', marginBottom: '16px' }}>Quick Stats</h3>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                    <div className="stat-card">
                        <h3>{flats.length}</h3>
                        <p>Total Flats</p>
                    </div>
                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}>
                        <h3>{flats.filter(f => f.status === 'occupied').length}</h3>
                        <p>Occupied</p>
                    </div>
                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' }}>
                        <h3>{flats.filter(f => f.status === 'available').length}</h3>
                        <p>Available</p>
                    </div>
                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' }}>
                        <h3>৳{flats.reduce((sum, f) => sum + (f.rent || 0), 0)}</h3>
                        <p>Total Monthly Rent</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
