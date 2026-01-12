import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import './Tree.css';

export default function TreeVerification() {
    const [trees, setTrees] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTrees();
        fetchLeaderboard();
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

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select an image');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

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
                <p style={{ color: '#6b7280', fontSize: '16px' }}>Upload tree pictures to earn monthly rewards!</p>
            </div>

            <div className="grid">
                <div className="card">
                    <h3 style={{ fontWeight: '700', marginBottom: '16px' }}>Upload Tree Picture</h3>
                    <form onSubmit={handleUpload}>
                        <div className="form-group">
                            <input
                                type="file"
                                accept="image/*"
                                className="form-control"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </div>
                        {error && <div className="alert alert-error">{error}</div>}
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Uploading...' : 'Submit'}
                        </button>
                    </form>
                    <p className="disclaimer" style={{ marginTop: '12px', padding: '12px', background: '#fef3c7', borderRadius: '8px', fontSize: '13px' }}>
                        <small><strong>Note:</strong> AI verification is automated. Admin reviews all submissions.</small>
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
            </div>

            <h2 style={{ marginTop: '32px', marginBottom: '16px', fontWeight: '700' }}>My Submissions</h2>
            <div className="grid">
                {trees.map((tree) => (
                    <div key={tree._id} className="card">
                        <img src={`http://localhost:5000${tree.imageUrl}`} alt="Tree" style={{ width: '100%', borderRadius: '8px' }} />
                        <p className={tree.status === 'approved' ? 'text-success' : tree.status === 'rejected' ? 'text-danger' : 'text-warning'}>
                            Status: {tree.status}
                        </p>
                        {tree.aiAnalysis && (
                            <p className="text-muted">
                                AI Confidence: {(tree.aiAnalysis.confidence * 100).toFixed(0)}%
                            </p>
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
