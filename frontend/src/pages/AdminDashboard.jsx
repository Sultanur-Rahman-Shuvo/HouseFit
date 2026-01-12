import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import './Admin.css';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('users');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({});

    useEffect(() => {
        fetchData();
        fetchStats();
    }, [activeTab]);

    const fetchStats = async () => {
        try {
            const response = await apiClient.get('/admin/stats');
            setStats(response.data.stats);
        } catch (err) {
            console.error('Stats error:', err);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            let endpoint = '';
            switch (activeTab) {
                case 'users': endpoint = '/admin/users'; break;
                case 'buildings': endpoint = '/admin/buildings'; break;
                case 'flats': endpoint = '/admin/flats'; break;
                case 'bookings': endpoint = '/admin/bookings'; break;
                case 'employees': endpoint = '/admin/employees'; break;
                default: endpoint = '/admin/users';
            }
            const response = await apiClient.get(endpoint);
            setData(response.data.data || response.data.users || response.data.buildings || response.data.flats || response.data.bookings || response.data.employees || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch data');
        }
        setLoading(false);
    };

    const handleApprove = async (id, type) => {
        try {
            if (type === 'booking') {
                await apiClient.put(`/admin/bookings/${id}/approve`);
            } else if (type === 'user') {
                await apiClient.put(`/admin/users/${id}/verify`);
            }
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (id, type) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            if (type === 'user') {
                await apiClient.delete(`/admin/users/${id}`);
            } else if (type === 'building') {
                await apiClient.delete(`/admin/buildings/${id}`);
            } else if (type === 'flat') {
                await apiClient.delete(`/admin/flats/${id}`);
            } else if (type === 'employee') {
                await apiClient.delete(`/admin/employees/${id}`);
            }
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Delete failed');
        }
    };

    return (
        <main className="container">
            <h1>Admin Dashboard</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>{stats.totalUsers || 0}</h3>
                    <p>Total Users</p>
                </div>
                <div className="stat-card">
                    <h3>{stats.totalBuildings || 0}</h3>
                    <p>Buildings</p>
                </div>
                <div className="stat-card">
                    <h3>{stats.totalFlats || 0}</h3>
                    <p>Flats</p>
                </div>
                <div className="stat-card">
                    <h3>{stats.pendingBookings || 0}</h3>
                    <p>Pending Bookings</p>
                </div>
            </div>

            <div className="admin-tabs">
                <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Users</button>
                <button className={activeTab === 'buildings' ? 'active' : ''} onClick={() => setActiveTab('buildings')}>Buildings</button>
                <button className={activeTab === 'flats' ? 'active' : ''} onClick={() => setActiveTab('flats')}>Flats</button>
                <button className={activeTab === 'bookings' ? 'active' : ''} onClick={() => setActiveTab('bookings')}>Bookings</button>
                <button className={activeTab === 'employees' ? 'active' : ''} onClick={() => setActiveTab('employees')}>Employees</button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="admin-table">
                    <table>
                        <thead>
                            <tr>
                                {activeTab === 'users' && <><th>Username</th><th>Email</th><th>Role</th><th>Verified</th><th>Actions</th></>}
                                {activeTab === 'buildings' && <><th>Name</th><th>Address</th><th>Flats</th><th>Actions</th></>}
                                {activeTab === 'flats' && <><th>Number</th><th>Building</th><th>Type</th><th>Price</th><th>Actions</th></>}
                                {activeTab === 'bookings' && <><th>User</th><th>Flat</th><th>Status</th><th>Date</th><th>Actions</th></>}
                                {activeTab === 'employees' && <><th>Name</th><th>Position</th><th>Building</th><th>Salary</th><th>Actions</th></>}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item._id}>
                                    {activeTab === 'users' && (
                                        <>
                                            <td>{item.username}</td>
                                            <td>{item.email}</td>
                                            <td>{item.role}</td>
                                            <td>{item.isVerified ? '✅' : '❌'}</td>
                                            <td>
                                                {!item.isVerified && (
                                                    <button className="btn btn-sm btn-primary" onClick={() => handleApprove(item._id, 'user')}>Verify</button>
                                                )}
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item._id, 'user')}>Delete</button>
                                            </td>
                                        </>
                                    )}
                                    {activeTab === 'buildings' && (
                                        <>
                                            <td>{item.name}</td>
                                            <td>{item.address}</td>
                                            <td>{item.flats?.length || 0}</td>
                                            <td>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item._id, 'building')}>Delete</button>
                                            </td>
                                        </>
                                    )}
                                    {activeTab === 'flats' && (
                                        <>
                                            <td>{item.flatNumber}</td>
                                            <td>{item.building?.name || 'N/A'}</td>
                                            <td>{item.flatType}</td>
                                            <td>৳{item.rentPrice}</td>
                                            <td>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item._id, 'flat')}>Delete</button>
                                            </td>
                                        </>
                                    )}
                                    {activeTab === 'bookings' && (
                                        <>
                                            <td>{item.user?.username || 'N/A'}</td>
                                            <td>{item.flat?.flatNumber || 'N/A'}</td>
                                            <td><span className={`badge badge-${item.status}`}>{item.status}</span></td>
                                            <td>{new Date(item.requestedDate).toLocaleDateString()}</td>
                                            <td>
                                                {item.status === 'pending' && (
                                                    <button className="btn btn-sm btn-primary" onClick={() => handleApprove(item._id, 'booking')}>Approve</button>
                                                )}
                                            </td>
                                        </>
                                    )}
                                    {activeTab === 'employees' && (
                                        <>
                                            <td>{item.name}</td>
                                            <td>{item.position}</td>
                                            <td>{item.building?.name || 'All'}</td>
                                            <td>৳{item.salary}</td>
                                            <td>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item._id, 'employee')}>Delete</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
}
