import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validatePassword } from '../utils/validation';
import { HiHome, HiUserCircle, HiOfficeBuilding, HiEye } from 'react-icons/hi';
import { RiAdminFill } from 'react-icons/ri';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateEmail(formData.email)) {
            setError('Please enter a valid email');
            return;
        }

        if (!validatePassword(formData.password)) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        const result = await login(formData.email, formData.password);
        setLoading(false);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-slide-up">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 text-white shadow-sm">
                            <HiHome className="w-5 h-5" />
                        </span>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            HouseFit
                        </h1>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        Login to your account
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Welcome back! Please enter your details
                    </p>
                </div>

                {error && (
                    <div className="alert alert-error animate-fade-in">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="form-group">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block py-3"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Logging in...
                            </span>
                        ) : 'Login'}
                    </button>
                </form>

                <div className="text-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Don't have an account? </span>
                    <Link to="/register" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                        Register
                    </Link>
                </div>

                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center">
                        Demo Accounts
                    </p>
                    <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                        <p className="flex items-center gap-2">
                            <RiAdminFill className="text-purple-600 flex-shrink-0" />
                            <span><strong>Admin:</strong> admin@housefit.local / Admin@123</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <HiOfficeBuilding className="text-blue-600 flex-shrink-0" />
                            <span><strong>Owner:</strong> owner1@test.com / Owner@123</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <HiUserCircle className="text-green-600 flex-shrink-0" />
                            <span><strong>Tenant:</strong> tenant1@test.com / Tenant@123</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <HiUserCircle className="text-orange-600 flex-shrink-0" />
                            <span><strong>Employee:</strong> emp1@test.com / Employee@123</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
