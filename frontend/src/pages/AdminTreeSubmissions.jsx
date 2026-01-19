import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

export default function AdminTreeSubmissions() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchSubmissions = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await apiClient.get('/admin/trees');
            const list = data?.data?.trees || data?.trees || [];
            setSubmissions(list);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load submissions');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const handleApprove = async (id) => {
        try {
            await apiClient.post(`/admin/trees/${id}/approve`);
            // Expect backend to increment tenant star points on approval
            fetchSubmissions();
        } catch (err) {
            alert(err.response?.data?.message || 'Approve failed');
        }
    };

    const handleReject = async (id) => {
        try {
            await apiClient.post(`/admin/trees/${id}/reject`);
            fetchSubmissions();
        } catch (err) {
            alert(err.response?.data?.message || 'Reject failed');
        }
    };

    return (
        <main className="container page">
            <div className="page-header">
                <h1 className="page-title">Tree Submissions</h1>
                <p className="page-subtitle">Review and approve tenant tree credentials</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {loading ? (
                <div className="loading">
                    <div className="flex flex-col items-center gap-3">
                        <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <p>Loading submissions...</p>
                    </div>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 animate-slide-up">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Preview</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Points Awarded</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">User Star Points</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Submitted</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {submissions.map((s) => (
                                    <tr key={s._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                            {`${s.userId?.firstName || ''} ${s.userId?.lastName || ''}`.trim() || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {s.imageUrl ? (
                                                <img src={s.imageUrl.startsWith('http') ? s.imageUrl : `http://localhost:5000${s.imageUrl}`} alt="Tree" className="w-20 h-16 object-cover rounded-md border border-gray-200 dark:border-gray-700" />
                                            ) : (
                                                <span className="text-gray-400">No image</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">{s.description || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`badge ${s.status === 'approved' ? 'badge-approved' : s.status === 'rejected' ? 'badge-rejected' : 'badge-pending'}`}>{s.status}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{s.pointsAwarded || 0}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{s.userId?.treePoints ?? '-'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{s.submittedAt ? new Date(s.submittedAt).toLocaleString() : '-'}</td>
                                        <td className="px-6 py-4 space-x-2">
                                            {s.status === 'pending' && (
                                                <>
                                                    <button className="btn btn-primary btn-sm" onClick={() => handleApprove(s._id)}>Approve</button>
                                                    <button className="btn btn-danger btn-sm" onClick={() => handleReject(s._id)}>Reject</button>
                                                </>
                                            )}
                                            {s.status !== 'pending' && (
                                                <span className="text-sm text-gray-500 dark:text-gray-400">No actions</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {submissions.length === 0 && (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">No submissions yet</div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
