import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { HiHome, HiSun, HiMoon, HiMenu, HiX } from 'react-icons/hi';

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 transition-colors duration-300">
            <div className="container">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link
                        to={isAuthenticated ? "/dashboard" : "/visitor"}
                        className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white hover:opacity-90 transition-opacity"
                    >
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 text-white shadow-sm">
                            <HiHome className="w-5 h-5" />
                        </span>
                        <span>HouseFit</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="nav-link">Dashboard</Link>

                                {user?.role === 'admin' && (
                                    <Link to="/admin/tree-submissions" className="nav-link">Tree Submissions</Link>
                                )}

                                {user?.role === 'tenant' && (
                                    <>
                                        <Link to="/billing" className="nav-link">Billing</Link>
                                        <Link to="/tree" className="nav-link">Tree Rewards</Link>
                                        <Link to="/leave" className="nav-link">Leave</Link>
                                    </>
                                )}



                                <Link to="/problems" className="nav-link">Problems</Link>
                                <Link to="/notifications" className="nav-link">Notifications</Link>
                                <Link to="/profile" className="nav-link">Profile</Link>

                                <button
                                    onClick={toggleTheme}
                                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    aria-label="Toggle theme"
                                >
                                    {isDark ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
                                </button>

                                <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/visitor" className="nav-link">Browse Flats</Link>

                                <button
                                    onClick={toggleTheme}
                                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    aria-label="Toggle theme"
                                >
                                    {isDark ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
                                </button>

                                <Link to="/login" className="btn btn-primary btn-sm">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-secondary btn-sm">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        >
                            {isDark ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden pb-4 space-y-2 animate-slide-down">
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                                {user?.role === 'admin' && (
                                    <Link to="/admin/tree-submissions" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Tree Submissions</Link>
                                )}
                                {user?.role === 'tenant' && (
                                    <>
                                        <Link to="/billing" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Billing</Link>
                                        <Link to="/tree" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Tree Rewards</Link>
                                        <Link to="/leave" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Leave</Link>
                                    </>
                                )}
                                <Link to="/problems" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Problems</Link>
                                <Link to="/notifications" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Notifications</Link>
                                <Link to="/profile" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="mobile-nav-link text-left w-full">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/visitor" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Browse Flats</Link>
                                <Link to="/login" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                                <Link to="/register" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Register</Link>
                            </>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
                .nav-link {
                    @apply text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors;
                }
                .mobile-nav-link {
                    @apply block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors;
                }
            `}</style>
        </nav>
    );
}
