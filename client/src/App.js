import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Components (ensure these files exist in src/components/)
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import EmployeeDashboard from './components/EmployeeDashboard';
import ManagerDashboard from './components/ManagerDashboard';

// Custom component to handle redirection based on role
const ProtectedDashboard = () => {
    const isAuthenticated = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (role === 'Manager') {
        return <ManagerDashboard />;
    } else if (role === 'Employee') {
        return <EmployeeDashboard />;
    } else {
        // Fallback for authenticated but role-less user
        return <Navigate to="/login" replace />;
    }
};

function App() {
    return (
        <Router>
            <Navbar />
            <div className="container mx-auto p-4">
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    
                    {/* Main Protected Route */}
                    <Route path="/dashboard" element={<ProtectedDashboard />} />

                    {/* Default Route redirects to Dashboard (which handles auth check) */}
                    <Route path="/" element={<ProtectedDashboard />} />

                    {/* Optional: Add a 404 page if needed */}
                    <Route path="*" element={<h2>404 Not Found</h2>} /> 
                </Routes>
            </div>
        </Router>
    );
}

export default App;