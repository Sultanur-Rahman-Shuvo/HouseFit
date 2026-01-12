import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
                case 'visitor':
                    navigate('/visitor');
                    break;
                default:
                    break;
            }
        }
    }, [user, navigate]);

    if (!user) return null;

    return (
        <main className="container">
            <div className="dashboard-header" style={{
                background: 'white',
                padding: '32px',
                borderRadius: '16px',
                marginBottom: '24px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
                <h1 style={{ fontSize: '32px', fontWeight: '700' }}>Welcome, {user.firstName}!</h1>
                <p className="text-muted">Role: <span className="badge badge-info">{user.role}</span></p>
            </div>

            <div className="grid">
                <div className="card">
                    <h3>Buildings</h3>
                    <p style={{ color: '#6b7280' }}>Browse available buildings and flats</p>
                </div>

                {user.role === 'tenant' && (
                    <>
                        <div className="card">
                            <h3>Billing</h3>
                            <p style={{ color: '#6b7280' }}>View and pay your bills</p>
                        </div>

                        <div className="card">
                            <h3>Tree Rewards</h3>
                            <p style={{ color: '#6b7280' }}>Upload tree pictures and earn rewards</p>
                        </div>

                        <div className="card">
                            <h3>Leave Requests</h3>
                            <p style={{ color: '#6b7280' }}>Submit and track your leave requests</p>
                        </div>
                    </>
                )}

                <div className="card">
                    <h3>Problems</h3>
                    <p style={{ color: '#6b7280' }}>Report and track maintenance issues</p>
                </div>

                <div className="card">
                    <h3>Notifications</h3>
                    <p style={{ color: '#6b7280' }}>View your notifications</p>
                </div>
            </div>
        </main>
    );
}
