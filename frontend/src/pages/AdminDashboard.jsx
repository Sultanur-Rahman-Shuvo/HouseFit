import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { HiUsers, HiOfficeBuilding, HiHome, HiDocumentText, HiBriefcase, HiCog } from 'react-icons/hi';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('users');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({});
    const [employees, setEmployees] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [assignModal, setAssignModal] = useState({ open: false, problemId: null });
    const [buildingModal, setBuildingModal] = useState(false);
    const [flatModal, setFlatModal] = useState(false);
    const [buildingForm, setBuildingForm] = useState({ name: '', address: '', totalFloors: '', totalFlats: '', facilities: '' });
    const [flatForm, setFlatForm] = useState({ buildingId: '', flatNumber: '', floor: '', area: '', bedrooms: '', bathrooms: '', rent: '', flatType: 'bachelor' });

    useEffect(() => {
        fetchData();
        fetchStats();
        fetchEmployees();
        fetchBuildings();
    }, [activeTab]);

    const fetchBuildings = async () => {
        try {
            const response = await apiClient.get('/admin/buildings');
            setBuildings(response.data?.data?.buildings || []);
        } catch (err) {
            console.error('Buildings fetch error:', err);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await apiClient.get('/admin/employees');
            setEmployees(response.data?.data?.employees || []);
        } catch (err) {
            console.error('Employees fetch error:', err);
        }
    };

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
                case 'problems': endpoint = '/admin/problems'; break;
                case 'salary-raises': endpoint = '/admin/salary-raises'; break;
                default: endpoint = '/admin/users';
            }
            const response = await apiClient.get(endpoint);
            let records = [];
            if (activeTab === 'users') {
                records = response.data?.data?.users || response.data?.users || [];
            } else if (activeTab === 'buildings') {
                records = response.data?.data?.buildings || response.data?.buildings || [];
            } else if (activeTab === 'flats') {
                records = response.data?.data?.flats || response.data?.flats || [];
            } else if (activeTab === 'bookings') {
                records = response.data?.data?.bookings || response.data?.bookings || [];
            } else if (activeTab === 'employees') {
                records = response.data?.data?.employees || response.data?.employees || [];
            } else if (activeTab === 'problems') {
                records = response.data?.data?.problems || response.data?.problems || [];
            } else if (activeTab === 'salary-raises') {
                records = response.data?.data?.raises || response.data?.raises || [];
            }
            setData(records);
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

    const handleAssignEmployee = async (problemId, employeeId) => {
        try {
            await apiClient.post(`/admin/problems/${problemId}/assign`, { employeeId });
            setAssignModal({ open: false, problemId: null });
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Assignment failed');
        }
    };

    const handleCreateBuilding = async (e) => {
        e.preventDefault();
        try {
            const facilitiesArray = buildingForm.facilities.split(',').map(f => f.trim()).filter(Boolean);
            await apiClient.post('/admin/buildings', {
                ...buildingForm,
                totalFloors: parseInt(buildingForm.totalFloors),
                totalFlats: parseInt(buildingForm.totalFlats),
                facilities: facilitiesArray,
            });
            alert('Building created successfully!');
            setBuildingModal(false);
            setBuildingForm({ name: '', address: '', totalFloors: '', totalFlats: '', facilities: '' });
            fetchData();
            fetchBuildings();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create building');
        }
    };

    const handleCreateFlat = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/admin/flats', {
                ...flatForm,
                floor: parseInt(flatForm.floor),
                area: parseInt(flatForm.area),
                bedrooms: parseInt(flatForm.bedrooms),
                bathrooms: parseInt(flatForm.bathrooms),
                rent: parseFloat(flatForm.rent),
            });
            alert('Flat created successfully!');
            setFlatModal(false);
            setFlatForm({ buildingId: '', flatNumber: '', floor: '', area: '', bedrooms: '', bathrooms: '', rent: '', flatType: 'bachelor' });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create flat');
        }
    };

    const handleApproveSalaryRaise = async (id) => {
        try {
            await apiClient.post(`/admin/salary-raises/${id}/approve`);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Approval failed');
        }
    };

    const handleRejectSalaryRaise = async (id) => {
        try {
            await apiClient.post(`/admin/salary-raises/${id}/reject`);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Rejection failed');
        }
    };

    const tabs = [
        { id: 'users', label: 'Users', icon: HiUsers },
        { id: 'buildings', label: 'Buildings', icon: HiOfficeBuilding },
        { id: 'flats', label: 'Flats', icon: HiHome },
        { id: 'bookings', label: 'Bookings', icon: HiDocumentText },
        { id: 'employees', label: 'Employees', icon: HiBriefcase },
        { id: 'problems', label: 'Problems', icon: HiCog },
        { id: 'salary-raises', label: 'Salary Raises', icon: HiBriefcase },
    ];

    return (
        <main className="container page">
            <div className="page-header">
                <h1 className="page-title">Admin Dashboard</h1>
                <p className="page-subtitle">Manage all aspects of the platform</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
                <div className="stat-card">
                    <h3>{stats.totalUsers || 0}</h3>
                    <p>Total Users</p>
                </div>
                <div className="stat-card bg-gradient-to-br from-emerald-600 to-green-600">
                    <h3>{stats.totalBuildings || 0}</h3>
                    <p>Buildings</p>
                </div>
                <div className="stat-card bg-gradient-to-br from-purple-600 to-pink-600">
                    <h3>{stats.totalFlats || 0}</h3>
                    <p>Flats</p>
                </div>
                <div className="stat-card bg-gradient-to-br from-orange-600 to-red-600">
                    <h3>{stats.pendingBookings || 0}</h3>
                    <p>Pending Bookings</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 overflow-x-auto">
                <div className="flex gap-2 border-b-2 border-gray-200 dark:border-gray-700 min-w-max">
                    {tabs.map(tab => {
                        const IconComponent = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all rounded-t-lg ${activeTab === tab.id
                                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <IconComponent className="w-5 h-5" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {error && <div className="alert alert-error animate-fade-in">{error}</div>}

            {/* Action Buttons */}
            {activeTab === 'buildings' && (
                <div className="mb-4">
                    <button className="btn btn-primary" onClick={() => setBuildingModal(true)}>+ Add Building</button>
                </div>
            )}
            {activeTab === 'flats' && (
                <div className="mb-4">
                    <button className="btn btn-primary" onClick={() => setFlatModal(true)}>+ Add Flat</button>
                </div>
            )}

            {loading ? (
                <div className="loading">
                    <div className="flex flex-col items-center gap-3">
                        <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <p>Loading data...</p>
                    </div>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 animate-slide-up">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    {activeTab === 'users' && (
                                        <>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Username</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                        </>
                                    )}
                                    {activeTab === 'buildings' && (
                                        <>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Address</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Flats</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                        </>
                                    )}
                                    {activeTab === 'flats' && (
                                        <>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Number</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Building</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Price</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                        </>
                                    )}
                                    {activeTab === 'bookings' && (
                                        <>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Flat</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                        </>
                                    )}
                                    {activeTab === 'employees' && (
                                        <>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Department</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                        </>
                                    )}
                                    {activeTab === 'problems' && (
                                        <>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Title</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Priority</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Reported By</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Assigned To</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                        </>
                                    )}
                                    {activeTab === 'salary-raises' && (
                                        <>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Employee</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Current Salary</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Requested</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Reason</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {data.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        {activeTab === 'users' && (
                                            <>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{item.username}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className="badge badge-info">{item.role}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`badge ${item.isVerified ? 'badge-approved' : 'badge-pending'}`}>
                                                        {item.isVerified ? 'Verified' : 'Unverified'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 space-x-2">
                                                    {!item.isVerified && (
                                                        <button className="btn btn-primary btn-sm" onClick={() => handleApprove(item._id, 'user')}>Verify</button>
                                                    )}
                                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item._id, 'user')}>Delete</button>
                                                </td>
                                            </>
                                        )}
                                        {activeTab === 'buildings' && (
                                            <>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.address}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.flats?.length || 0}</td>
                                                <td className="px-6 py-4">
                                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item._id, 'building')}>Delete</button>
                                                </td>
                                            </>
                                        )}
                                        {activeTab === 'flats' && (
                                            <>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{item.flatNumber}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.building?.name || 'N/A'}</td>
                                                <td className="px-6 py-4">
                                                    <span className="badge badge-info">{item.flatType}</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">৳{item.rent}</td>
                                                <td className="px-6 py-4">
                                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item._id, 'flat')}>Delete</button>
                                                </td>
                                            </>
                                        )}
                                        {activeTab === 'bookings' && (
                                            <>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{item.user?.username || 'N/A'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.flat?.flatNumber || 'N/A'}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`badge badge-${item.status}`}>{item.status}</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{new Date(item.requestedDate).toLocaleDateString()}</td>
                                                <td className="px-6 py-4">
                                                    {item.status === 'pending' && (
                                                        <button className="btn btn-primary btn-sm" onClick={() => handleApprove(item._id, 'booking')}>Approve</button>
                                                    )}
                                                </td>
                                            </>
                                        )}
                                        {activeTab === 'employees' && (
                                            <>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {item.userId?.firstName} {item.userId?.lastName}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.userId?.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className="badge badge-info">{item.department}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`badge ${item.status === 'active' ? 'badge-approved' : 'badge-pending'}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item._id, 'employee')}>Delete</button>
                                                </td>
                                            </>
                                        )}
                                        {activeTab === 'problems' && (
                                            <>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{item.title}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`badge ${item.priority === 'urgent' ? 'badge-danger' :
                                                        item.priority === 'high' ? 'badge-warning' :
                                                            'badge-info'
                                                        }`}>
                                                        {item.priority || 'medium'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`badge ${item.status === 'resolved' ? 'badge-approved' :
                                                        item.status === 'in-progress' ? 'badge-warning' :
                                                            item.status === 'assigned' ? 'badge-info' :
                                                                'badge-pending'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                    {item.reportedBy?.firstName} {item.reportedBy?.lastName}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                    {item.assignedTo ? (
                                                        <span className="badge badge-approved">
                                                            {item.assignedTo.userId?.firstName || 'Assigned'}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400">Unassigned</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => setAssignModal({ open: true, problemId: item._id })}
                                                    >
                                                        {item.assignedTo ? 'Reassign' : 'Assign'}
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                        {activeTab === 'salary-raises' && (
                                            <>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                    {item.employeeId?.userId?.firstName} {item.employeeId?.userId?.lastName}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                    ${item.currentSalary}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                    ${item.requestedSalary}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                                                    {item.reason}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`badge ${item.status === 'approved' ? 'badge-approved' :
                                                        item.status === 'rejected' ? 'badge-danger' :
                                                            'badge-pending'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.status === 'pending' && (
                                                        <div className="flex gap-2">
                                                            <button
                                                                className="btn btn-success btn-sm"
                                                                onClick={() => handleApproveSalaryRaise(item._id)}
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => handleRejectSalaryRaise(item._id)}
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {data.length === 0 && !loading && (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                No data available
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Assign Employee Modal */}
            {assignModal.open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Assign Employee</h2>
                        <p className="mb-4 text-gray-600 dark:text-gray-400">Select an employee to assign to this problem:</p>

                        <div className="space-y-2 max-h-80 overflow-y-auto mb-6">
                            {employees.filter(emp => emp.status === 'active').map(emp => (
                                <button
                                    key={emp._id}
                                    onClick={() => handleAssignEmployee(assignModal.problemId, emp._id)}
                                    className="w-full text-left px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                                >
                                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                                        {emp.userId?.firstName} {emp.userId?.lastName}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {emp.department} - {emp.designation}
                                    </div>
                                </button>
                            ))}
                            {employees.filter(emp => emp.status === 'active').length === 0 && (
                                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                                    No active employees available
                                </p>
                            )}
                        </div>

                        <button
                            onClick={() => setAssignModal({ open: false, problemId: null })}
                            className="btn btn-secondary w-full"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Building Modal */}
            {buildingModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Add New Building</h2>

                        <form onSubmit={handleCreateBuilding} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Building Name</label>
                                <input
                                    type="text"
                                    value={buildingForm.name}
                                    onChange={(e) => setBuildingForm({ ...buildingForm, name: e.target.value })}
                                    className="input"
                                    placeholder="e.g., Block A"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Address</label>
                                <input
                                    type="text"
                                    value={buildingForm.address}
                                    onChange={(e) => setBuildingForm({ ...buildingForm, address: e.target.value })}
                                    className="input"
                                    placeholder="Building address"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Total Floors</label>
                                    <input
                                        type="number"
                                        value={buildingForm.totalFloors}
                                        onChange={(e) => setBuildingForm({ ...buildingForm, totalFloors: e.target.value })}
                                        className="input"
                                        placeholder="10"
                                        min="1"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Total Flats</label>
                                    <input
                                        type="number"
                                        value={buildingForm.totalFlats}
                                        onChange={(e) => setBuildingForm({ ...buildingForm, totalFlats: e.target.value })}
                                        className="input"
                                        placeholder="40"
                                        min="1"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Facilities (comma-separated)</label>
                                <input
                                    type="text"
                                    value={buildingForm.facilities}
                                    onChange={(e) => setBuildingForm({ ...buildingForm, facilities: e.target.value })}
                                    className="input"
                                    placeholder="Gym, Pool, Parking"
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button type="submit" className="btn btn-primary flex-1">Create Building</button>
                                <button
                                    type="button"
                                    onClick={() => setBuildingModal(false)}
                                    className="btn btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Flat Modal */}
            {flatModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Add New Flat</h2>

                        <form onSubmit={handleCreateFlat} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Building</label>
                                <select
                                    value={flatForm.buildingId}
                                    onChange={(e) => setFlatForm({ ...flatForm, buildingId: e.target.value })}
                                    className="input"
                                    required
                                >
                                    <option value="">Select a building</option>
                                    {buildings.map(building => (
                                        <option key={building._id} value={building._id}>
                                            {building.name} - {building.address}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Flat Number</label>
                                    <input
                                        type="text"
                                        value={flatForm.flatNumber}
                                        onChange={(e) => setFlatForm({ ...flatForm, flatNumber: e.target.value })}
                                        className="input"
                                        placeholder="A-101"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Floor</label>
                                    <input
                                        type="number"
                                        value={flatForm.floor}
                                        onChange={(e) => setFlatForm({ ...flatForm, floor: e.target.value })}
                                        className="input"
                                        placeholder="1"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Area (sq ft)</label>
                                    <input
                                        type="number"
                                        value={flatForm.area}
                                        onChange={(e) => setFlatForm({ ...flatForm, area: e.target.value })}
                                        className="input"
                                        placeholder="1200"
                                        min="1"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Rent ($)</label>
                                    <input
                                        type="number"
                                        value={flatForm.rent}
                                        onChange={(e) => setFlatForm({ ...flatForm, rent: e.target.value })}
                                        className="input"
                                        placeholder="1500"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Bedrooms</label>
                                    <input
                                        type="number"
                                        value={flatForm.bedrooms}
                                        onChange={(e) => setFlatForm({ ...flatForm, bedrooms: e.target.value })}
                                        className="input"
                                        placeholder="3"
                                        min="1"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Bathrooms</label>
                                    <input
                                        type="number"
                                        value={flatForm.bathrooms}
                                        onChange={(e) => setFlatForm({ ...flatForm, bathrooms: e.target.value })}
                                        className="input"
                                        placeholder="2"
                                        min="1"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Flat Type</label>
                                <select
                                    value={flatForm.flatType}
                                    onChange={(e) => setFlatForm({ ...flatForm, flatType: e.target.value })}
                                    className="input"
                                    required
                                >
                                    <option value="">Select type</option>
                                    <option value="bachelor">Bachelor</option>
                                    <option value="family">Family</option>
                                </select>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button type="submit" className="btn btn-primary flex-1">Create Flat</button>
                                <button
                                    type="button"
                                    onClick={() => setFlatModal(false)}
                                    className="btn btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
