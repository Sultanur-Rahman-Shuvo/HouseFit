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
        <main className="container">
            <h1>Notifications</h1>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="notifications-list">
                    {notifications.map((notif) => (
                        <div key={notif._id} className={`notification-item ${notif.isRead ? 'read' : 'unread'}`}>
                            <h4>{notif.title}</h4>
                            <p>{notif.message}</p>
                            <p className="text-muted">{new Date(notif.createdAt).toLocaleString()}</p>
                            {!notif.isRead && (
                                <button className="btn btn-sm btn-secondary" onClick={() => markAsRead(notif._id)}>
                                    Mark as Read
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
