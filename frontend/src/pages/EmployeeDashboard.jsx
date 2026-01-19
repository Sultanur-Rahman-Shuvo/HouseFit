import React, { useState, useEffect } from 'react';
import { HiBriefcase, HiCurrencyDollar, HiDocumentText } from 'react-icons/hi';
import apiClient from '../api/apiClient';

export default function EmployeeDashboard() {
    const [profile, setProfile] = useState(null);
    const [raises, setRaises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showRaiseForm, setShowRaiseForm] = useState(false);
    const [raiseForm, setRaiseForm] = useState({ requestedSalary: '', reason: '' });

    useEffect(() => {
        fetchProfile();
        fetchRaises();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await apiClient.get('/employees/profile');
            setProfile(data?.data?.employee);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load profile');
        }
        setLoading(false);
    };

    const fetchRaises = async () => {
        try {
            const { data } = await apiClient.get('/employees/salary-raises');
            setRaises(data?.data?.raises || []);
        } catch (err) {
            console.error('Raises fetch error:', err);
        }
    };

    const handleSubmitRaise = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/employees/salary-raise', raiseForm);
            alert('Salary raise request submitted successfully!');
            setShowRaiseForm(false);
            setRaiseForm({ requestedSalary: '', reason: '' });
            fetchRaises();
        } catch (err) {
            alert(err.response?.data?.message || 'Request failed');
        }
    };

    if (loading) return <main className="container page"><div className="loading">Loading...</div></main>;

    return (
        <main className="container page">
            <div className="page-header">
                <h1 className="page-title">Employee Dashboard</h1>
                <p className="page-subtitle">Manage your profile and salary requests</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="stat-card">
                    <HiBriefcase className="w-8 h-8 mb-2 text-blue-600" />
                    <h3>{profile?.department || 'N/A'}</h3>
                    <p>Department</p>
                </div>
                <div className="stat-card bg-gradient-to-br from-emerald-600 to-green-600">
                    <HiCurrencyDollar className="w-8 h-8 mb-2" />
                    <h3>৳{profile?.salary || 0}</h3>
                    <p>Current Salary</p>
                </div>
                <div className="stat-card bg-gradient-to-br from-purple-600 to-pink-600">
                    <HiDocumentText className="w-8 h-8 mb-2" />
                    <h3>{raises.filter(r => r.status === 'pending').length}</h3>
                    <p>Pending Requests</p>
                </div>
            </div>

            <div className="card border border-gray-200 dark:border-gray-700 shadow-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Profile</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                    <p><strong>Name:</strong> {profile?.userId?.firstName} {profile?.userId?.lastName}</p>
                    <p><strong>Employee ID:</strong> {profile?.employeeId}</p>
                    <p><strong>Email:</strong> {profile?.userId?.email}</p>
                    <p><strong>Phone:</strong> {profile?.userId?.phone || 'N/A'}</p>
                    <p><strong>Designation:</strong> {profile?.designation}</p>
                    <p><strong>Status:</strong> <span className={`badge ${profile?.status === 'active' ? 'badge-approved' : 'badge-warning'}`}>{profile?.status}</span></p>
                    <p><strong>Join Date:</strong> {profile?.joinDate ? new Date(profile.joinDate).toLocaleDateString() : 'N/A'}</p>
                </div>
            </div>

            <div className="card border border-gray-200 dark:border-gray-700 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Salary Raise Requests</h2>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setShowRaiseForm(!showRaiseForm)}
                    >
                        Request Raise
                    </button>
                </div>

                {showRaiseForm && (
                    <form onSubmit={handleSubmitRaise} className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Requested Salary (৳)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={raiseForm.requestedSalary}
                                    onChange={(e) => setRaiseForm({ ...raiseForm, requestedSalary: e.target.value })}
                                    required
                                    min={profile?.salary || 0}
                                />
                            </div>
                            <div className="form-group col-span-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Reason</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={raiseForm.reason}
                                    onChange={(e) => setRaiseForm({ ...raiseForm, reason: e.target.value })}
                                    required
                                    placeholder="Explain why you deserve this raise..."
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button type="submit" className="btn btn-primary btn-sm">Submit Request</button>
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowRaiseForm(false)}>Cancel</button>
                        </div>
                    </form>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Current</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Requested</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Reason</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Response</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {raises.map((raise) => (
                                <tr key={raise._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">৳{raise.currentSalary}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">৳{raise.requestedSalary}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">{raise.reason}</td>
                                    <td className="px-4 py-3">
                                        <span className={`badge ${raise.status === 'approved' ? 'badge-approved' : raise.status === 'rejected' ? 'badge-rejected' : 'badge-pending'}`}>
                                            {raise.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{raise.adminResponse || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {raises.length === 0 && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">No requests yet</div>
                    )}
                </div>
            </div>
        </main>
    );
}
