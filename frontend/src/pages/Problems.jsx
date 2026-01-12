import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

export default function Problems() {
    const [problems, setProblems] = useState([]);
    const [formData, setFormData] = useState({ title: '', description: '', category: 'maintenance' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            const response = await apiClient.get('/problems');
            setProblems(response.data.problems || []);
        } catch (err) {
            console.error('Problems fetch error:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await apiClient.post('/problems', formData);
            alert('Problem reported!');
            setFormData({ title: '', description: '', category: 'maintenance' });
            fetchProblems();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to report problem');
        }
        setLoading(false);
    };

    return (
        <main className="container">
            <h1>Problem Reports</h1>

            <div className="grid">
                <div className="card">
                    <h3>Report a Problem</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select
                                className="form-control"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="maintenance">Maintenance</option>
                                <option value="cleanliness">Cleanliness</option>
                                <option value="security">Security</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                className="form-control"
                                rows="4"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

            <h2>All Reports</h2>
            <div className="grid">
                {problems.map((problem) => (
                    <div key={problem._id} className="card">
                        <h3>{problem.title}</h3>
                        <p className="text-muted">{problem.category}</p>
                        <p>{problem.description}</p>
                        <p className={problem.status === 'resolved' ? 'text-success' : 'text-warning'}>
                            Status: {problem.status}
                        </p>
                        <p className="text-muted">
                            By: {problem.reportedBy?.username} - {new Date(problem.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>
        </main>
    );
}
