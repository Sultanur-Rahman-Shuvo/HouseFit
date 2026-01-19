import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

export default function Problems() {
    const [problems, setProblems] = useState([]);
    const [formData, setFormData] = useState({ title: '', description: '' });
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
            setFormData({ title: '', description: '' });
            fetchProblems();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to report problem');
        }
        setLoading(false);
    };

    const total = problems.length;
    const resolved = problems.filter(p => p.status === 'resolved').length;
    const pending = problems.filter(p => p.status !== 'resolved').length;
    const formatDate = (date) => new Date(date).toLocaleString();

    return (
        <main className="container py-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Problems & Support</h1>
                    <p className="text-gray-600 dark:text-gray-400">Report issues and track progress across all roles.</p>
                </div>
                <div className="flex gap-3">
                    <div className="px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 font-semibold">
                        Total: {total}
                    </div>
                    <div className="px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200 font-semibold">
                        Resolved: {resolved}
                    </div>
                    <div className="px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 font-semibold">
                        Open: {pending}
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-10">
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                    <div className="mb-4">
                        <p className="text-sm text-blue-600 dark:text-blue-300 font-semibold">New Issue</p>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Report a Problem</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Describe what went wrong and we will route it to the right person.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-group">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Water leakage in kitchen"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                            <textarea
                                className="form-control"
                                rows="4"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Add details, location, and any relevant notes"
                                required
                            />
                        </div>
                        {error && <div className="alert alert-error">{error}</div>}
                        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Problem'}
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    {problems.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center text-gray-600 dark:text-gray-300">
                            No problems reported yet. Submit your first issue above.
                        </div>
                    ) : (
                        problems.map((problem) => (
                            <div key={problem._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{problem.title}</h3>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{problem.description}</p>
                                    </div>
                                    <span className={`badge ${problem.status === 'resolved' ? 'badge-approved' : problem.status === 'in-progress' ? 'badge-warning' : 'badge-pending'}`}>
                                        {problem.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-3">
                                    <span>Priority: {problem.priority || 'medium'}</span>
                                    <span>{formatDate(problem.createdAt)}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
