import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import VisitorDashboard from './pages/VisitorDashboard';
import FlatDetails from './pages/FlatDetails';
import TreeVerification from './pages/TreeVerification';
import Billing from './pages/Billing';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import BookingRequests from './pages/BookingRequests';
import Problems from './pages/Problems';
import Leave from './pages/Leave';

// Private Route wrapper
const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

// Role-based route
const RoleRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/visitor" element={<VisitorDashboard />} />
                <Route path="/flat/:id" element={<FlatDetails />} />

                {/* Protected routes */}
                <Route path="/dashboard" element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } />

                <Route path="/profile" element={
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                } />

                <Route path="/notifications" element={
                    <PrivateRoute>
                        <Notifications />
                    </PrivateRoute>
                } />

                {/* Role-based routes */}
                <Route path="/admin" element={
                    <RoleRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                    </RoleRoute>
                } />

                <Route path="/owner" element={
                    <RoleRoute allowedRoles={['owner']}>
                        <OwnerDashboard />
                    </RoleRoute>
                } />

                {/* Visitor routes (now public) */}

                <Route path="/tree" element={
                    <RoleRoute allowedRoles={['tenant']}>
                        <TreeVerification />
                    </RoleRoute>
                } />

                <Route path="/billing" element={
                    <RoleRoute allowedRoles={['tenant']}>
                        <Billing />
                    </RoleRoute>
                } />

                <Route path="/booking-requests" element={
                    <PrivateRoute>
                        <BookingRequests />
                    </PrivateRoute>
                } />

                <Route path="/problems" element={
                    <PrivateRoute>
                        <Problems />
                    </PrivateRoute>
                } />

                <Route path="/leave" element={
                    <RoleRoute allowedRoles={['tenant']}>
                        <Leave />
                    </RoleRoute>
                } />

                {/* Default redirect */}
                <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/visitor"} />} />

                {/* Catch-all 404 route */}
                <Route path="*" element={
                    <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
                        <h1>404 - Page Not Found</h1>
                        <p>The page you're looking for doesn't exist.</p>
                        <button className="btn btn-primary" onClick={() => window.location.href = '/'}>Go Home</button>
                    </div>
                } />
            </Routes>

            {isAuthenticated && <Footer />}
        </BrowserRouter>
    );
}

export default App;
