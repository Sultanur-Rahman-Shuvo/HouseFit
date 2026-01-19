import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOfficeBuilding, HiCash, HiBell, HiExclamationCircle, HiDocumentText, HiPhotograph } from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            switch (user.role) {
                case 'admin':
                    navigate('/admin');
                    break;
                case 'owner':
                    navigate('/owner');
                    break;
                case 'employee':
                    navigate('/employee');
                    break;
                default:
                    break;
            }
        }
    }, [user, navigate]);

    if (!user) return null;

    const quickActions = [
        {
            title: 'Buildings & Flats',
            description: 'Browse available flats and request bookings',
            icon: HiOfficeBuilding,
            path: '/visitor',
            accent: 'from-blue-500 to-indigo-600',
        },
        {
            title: 'Billing',
            description: 'View and settle your monthly bills',
            icon: HiCash,
            path: '/billing',
            accent: 'from-emerald-500 to-green-600',
        },
        {
            title: 'Report Problem',
            description: 'Log maintenance issues and track progress',
            icon: HiExclamationCircle,
            path: '/problems',
            accent: 'from-amber-500 to-orange-600',
        },
        {
            title: 'Leave Requests',
            description: 'Submit and follow your leave requests',
            icon: HiDocumentText,
            path: '/leave',
            accent: 'from-purple-500 to-pink-500',
        },
        {
            title: 'Tree Rewards',
            description: 'Upload tree photos and earn rewards',
            icon: HiPhotograph,
            path: '/tree',
            accent: 'from-teal-500 to-cyan-500',
        },
        {
            title: 'Notifications',
            description: 'Stay on top of updates from management',
            icon: HiBell,
            path: '/notifications',
            accent: 'from-slate-600 to-gray-800',
        },
    ];

    return (
        <main className="container page">
            <div className="page-header">
                <h1 className="page-title">Tenant Dashboard</h1>
                <p className="page-subtitle">Central hub for your stay with the same styling as admin</p>
                <div className="mt-3 inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="badge badge-info capitalize">{user.role}</span>
                    <span className="text-gray-500 dark:text-gray-400">Welcome back, {user.firstName}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {quickActions.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.title}
                            onClick={() => navigate(item.path)}
                            className="card relative overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.accent}`} />
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                                    <Icon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.description}</p>
                                </div>
                            </div>
                            <div className="mt-4 text-sm text-blue-600 dark:text-blue-400 font-semibold">Go to {item.title}</div>
                        </button>
                    );
                })}
            </div>
        </main>
    );
}
