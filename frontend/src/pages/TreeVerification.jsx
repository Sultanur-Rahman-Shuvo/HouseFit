import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import './Tree.css';

export default function TreeVerification() {
    const [trees, setTrees] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [file, setFile] = useState(null);
    const [location, setLocation] = useState('');
    const [plantedDate, setPlantedDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [myPoints, setMyPoints] = useState(0);

    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const MAX_SIZE_MB = 5;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    useEffect(() => {
        fetchTrees();
        fetchLeaderboard();
        fetchMyPoints();
    }, []);

    const fetchTrees = async () => {
        try {
            const response = await apiClient.get('/trees/my-submissions');
            setTrees(response.data.submissions || []);
        } catch (err) {
            console.error('Trees fetch error:', err);
        }
    };

    const fetchLeaderboard = async () => {
        try {
            const response = await apiClient.get('/trees/leaderboard');
            setLeaderboard(response.data.leaderboard || []);
        } catch (err) {
            console.error('Leaderboard fetch error:', err);
        }
    };

    const fetchMyPoints = async () => {
        try {
            const response = await apiClient.get('/auth/me');
            const user = response.data?.data?.user || response.data?.user;
            setMyPoints(user?.treePoints || 0);
        } catch (err) {
            console.error('My points fetch error:', err);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select an image');
            return;
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            setError('Unsupported file format. Allowed: JPG, JPEG, PNG, WEBP.');
            return;
        }

        if (file.size > MAX_SIZE_BYTES) {
            setError(`File is too large. Max size is ${MAX_SIZE_MB}MB.`);
            return;
        }

        const formData = new FormData();
        formData.append('tree', file); // backend expects field name 'tree'
        formData.append('location', location);
        formData.append('plantedDate', plantedDate);

        setLoading(true);
        setError('');
        try {
            await apiClient.post('/trees/submit', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Tree submitted for verification!');
            setFile(null);
            fetchTrees();
            fetchLeaderboard();
            fetchMyPoints();
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed');
        }
        setLoading(false);
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
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>Tree Rewards</h1>
                <p style={{ color: '#6b7280', fontSize: '16px' }}>Upload tree credentials; admin approves to grant star points.</p>
            </div>

            <div className="grid">
                <div className="card">
                    <h3 style={{ fontWeight: '700', marginBottom: '16px' }}>Upload Tree Credentials</h3>
                    <form onSubmit={handleUpload}>
                        <div className="form-group">
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/gif,.jpg,.jpeg,.png,.gif"
                                className="form-control"
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    setError('');
                                    if (!f) { setFile(null); return; }
                                    if (!ALLOWED_TYPES.includes(f.type)) {
                                        setFile(null);
                                        setError('Unsupported file format. Allowed: JPG, JPEG, PNG, GIF.');
                                        return;
                                    }
                                    if (f.size > MAX_SIZE_BYTES) {
                                        setFile(null);
                                        setError(`File is too large. Max size is ${MAX_SIZE_MB}MB.`);
                                        return;
                                    }
                                    setFile(f);
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g., Building garden, Sector 12"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="block text-sm font-medium text-gray-700">Planted Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={plantedDate}
                                onChange={(e) => setPlantedDate(e.target.value)}
                                required
                            />
                        </div>
                        {error && <div className="alert alert-error">{error}</div>}
                        <p className="text-sm text-gray-600" style={{ marginTop: '8px' }}>
                            Allowed formats: JPG, JPEG, PNG, GIF. Max size: {MAX_SIZE_MB}MB.
                        </p>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Uploading...' : 'Submit'}
                        </button>
                    </form>
                    <p className="disclaimer" style={{ marginTop: '12px', padding: '12px', background: '#e0f2fe', borderRadius: '8px', fontSize: '13px' }}>
                        <small><strong>Note:</strong> Admin reviews and approves submissions. Approved entries earn 1 star.</small>
                    </p>
                </div>

                <div className="card">
                    <h3 style={{ fontWeight: '700', marginBottom: '16px' }}>Leaderboard</h3>
                    <div className="leaderboard">
                        {leaderboard.map((entry, index) => (
                            <div key={entry.user._id} className="leaderboard-item">
                                <span className="rank">#{index + 1}</span>
                                <span>{entry.user.username}</span>
                                <span className="count">{entry.count} trees</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="card">
                    <h3 style={{ fontWeight: '700', marginBottom: '16px' }}>My Star Points</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ fontSize: '28px', fontWeight: '700', color: '#f59e0b' }}>★</div>
                        <div>
                            <div style={{ fontSize: '24px', fontWeight: '700' }}>{myPoints}</div>
                            <p className="text-muted">Total points awarded by admin</p>
                        </div>
                    </div>
                </div>
            </div>

            <h2 style={{ marginTop: '32px', marginBottom: '16px', fontWeight: '700' }}>My Submissions</h2>
            <div className="grid">
                {trees.map((tree) => (
                    <div key={tree._id} className="card">
                        <img src={`http://localhost:5000${tree.imageUrl}`} alt="Tree" style={{ width: '100%', borderRadius: '8px' }} />
                        <p className={tree.status === 'approved' ? 'text-success' : tree.status === 'rejected' ? 'text-danger' : 'text-warning'}>
                            Status: {tree.status}
                        </p>
                        {tree.pointsAwarded > 0 && (
                            <p className="text-success"><strong>Points Awarded:</strong> {tree.pointsAwarded}</p>
                        )}
                        <p className="text-muted">
                            {new Date(tree.submittedAt).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>
        </main>
    );
}
