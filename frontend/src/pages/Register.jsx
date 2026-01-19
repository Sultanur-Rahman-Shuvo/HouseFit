import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validatePassword, validateRequired, validatePhone } from '../utils/validation';
import { HiHome } from 'react-icons/hi';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: 'tenant',
        region: 'BD',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateRequired(formData.username) || !validateRequired(formData.firstName) || !validateRequired(formData.lastName)) {
            setError('All fields are required');
            return;
        }

        if (!validateEmail(formData.email)) {
            setError('Please enter a valid email');
            return;
        }

        if (!validatePassword(formData.password)) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (!validatePhone(formData.phone)) {
            setError('Phone must be 11 digits (01XXXXXXXXX)');
            return;
        }

        setLoading(true);
        const result = await register(formData);
        setLoading(false);

        if (result.success) {
            navigate('/login');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full space-y-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-slide-up">
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
                        Create an account
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Join us to find your perfect home
                    </p>
                </div>

                {error && <div className="alert alert-error animate-fade-in">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            className="form-control"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            className="form-control"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <select
                                name="region"
                                className="form-control"
                                value={formData.region}
                                onChange={handleChange}
                                style={{ maxWidth: '160px' }}
                            >
                                <option value="BD">Bangladesh (+880)</option>
                            </select>
                            <input
                                type="text"
                                name="phone"
                                className="form-control"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="01XXXXXXXXX"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Role</label>
                        <select
                            name="role"
                            className="form-control"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="tenant">Tenant</option>
                            <option value="owner">Owner</option>
                            <option value="employee">Employee</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <div className="text-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
                    <Link to="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
