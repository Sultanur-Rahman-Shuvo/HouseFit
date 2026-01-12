import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to={isAuthenticated ? "/dashboard" : "/visitor"} className="navbar-brand">
                    HouseFit
                </Link>

                <div className="navbar-links">
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard">Dashboard</Link>

                            {user?.role === 'admin' && (
                                <Link to="/admin">Admin</Link>
                            )}

                            {user?.role === 'owner' && (
                                <Link to="/owner">My Flats</Link>
                            )}

                            {user?.role === 'tenant' && (
                                <>
                                    <Link to="/billing">Billing</Link>
                                    <Link to="/tree">Tree Rewards</Link>
                                    <Link to="/leave">Leave</Link>
                                </>
                            )}

                            <Link to="/problems">Problems</Link>
                            <Link to="/notifications">Notifications</Link>
                            <Link to="/profile">Profile</Link>

                            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/visitor">Browse Flats</Link>
                            <Link to="/login" className="btn btn-primary btn-sm">
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-secondary btn-sm">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
