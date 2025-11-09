import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import EmployeeDashboard from './components/EmployeeDashboard';
import ManagerDashboard from './components/ManagerDashboard'; // Import the ManagerDashboard
import setAuthToken from './utils/setAuthToken';
import './App.css';

// Check for token on load and set global headers if present
if (localStorage.token) {
    setAuthToken(localStorage.token);
}

const App = () => {
    // Optional: Re-run token check on component mount if needed for initialization
    useEffect(() => {
        if (localStorage.token) {
            setAuthToken(localStorage.token);
        }
    }, []);

    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<EmployeeDashboard />} />
                    {/* FIX: Add route for Manager Dashboard */}
                    <Route path="/manager" element={<ManagerDashboard />} /> 
                    
                    {/* Default path (e.g., landing page or redirect unauthenticated users to login) */}
                    <Route path="/" element={<h1>Welcome to the Leave System</h1>} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;