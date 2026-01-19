import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await apiClient.get('/notifications');
            setNotifications(response.data.notifications || []);
        } catch (err) {
            console.error('Notifications fetch error:', err);
        }
        setLoading(false);
    };

    const markAsRead = async (id) => {
        try {
            await apiClient.put(`/notifications/${id}/read`);
            fetchNotifications();
        } catch (err) {
            console.error('Mark read error:', err);
        }
    };

    return (
        <main className="container py-10">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Notifications</h1>
                    <p className="text-gray-600 dark:text-gray-400">Stay on top of updates, approvals, and alerts.</p>
                </div>
                <div className="px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 text-sm font-semibold">
                    {notifications.filter(n => !n.isRead).length} Unread
                </div>
            </div>

            {loading ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center text-gray-600 dark:text-gray-300">
                    Loading notifications...
                </div>
            ) : notifications.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-center text-gray-600 dark:text-gray-300">
                    <p className="text-lg font-semibold">All clear ✅</p>
                    <p className="mt-2">No notifications right now.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {notifications.map((notif) => (
                        <div
                            key={notif._id}
                            className={`rounded-xl border shadow-sm p-5 transition-all ${notif.isRead
                                ? 'bg-gray-50 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700'
                                : 'bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700 ring-2 ring-blue-100 dark:ring-blue-900/50'
                                }`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{notif.title}</h4>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{notif.message}</p>
                                </div>
                                {!notif.isRead && (
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => markAsRead(notif._id)}
                                    >
                                        Mark as Read
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                                <span>{new Date(notif.createdAt).toLocaleString()}</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${notif.isRead
                                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                                    : 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200'
                                    }`}>
                                    {notif.isRead ? 'Read' : 'New'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
