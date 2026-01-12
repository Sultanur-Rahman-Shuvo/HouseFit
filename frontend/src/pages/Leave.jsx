import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

export default function Leave() {
    const [leaves, setLeaves] = useState([]);
    const [formData, setFormData] = useState({ startDate: '', endDate: '', reason: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const response = await apiClient.get('/leave/my-requests');
            setLeaves(response.data.requests || []);
        } catch (err) {
            console.error('Leave fetch error:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await apiClient.post('/leave', formData);
            alert('Leave request submitted!');
            setFormData({ startDate: '', endDate: '', reason: '' });
            fetchLeaves();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit leave request');
        }
        setLoading(false);
    };

    return (
        <main className="container">
            <h1>Leave Requests</h1>

            <div className="grid">
                <div className="card">
                    <h3>Request Leave</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Start Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>End Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Reason</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                required
                            />
                        </div>
                        {error && <div className="alert alert-error">{error}</div>}
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>
                </div>
            </div>

            <h2>My Requests</h2>
            <div className="grid">
                {leaves.map((leave) => (
                    <div key={leave._id} className="card">
                        <h3>{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</h3>
                        <p>{leave.reason}</p>
                        <p className={leave.status === 'approved' ? 'text-success' : leave.status === 'rejected' ? 'text-danger' : 'text-warning'}>
                            Status: {leave.status}
                        </p>
                    </div>
                ))}
            </div>
        </main>
    );
}
