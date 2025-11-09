// client/src/App.js

import React from 'react';
// We need to import 'Navigate' for the redirect
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Import our components
import Login from './components/Login';
import Register from './components/Register';
import EmployeeDashboard from './components/EmployeeDashboard';
import ManagerDashboard from './components/ManagerDashboard';
// Home.js is no longer needed
import Navbar from './components/Navbar'; 

import './App.css'; 

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                
                <Routes>
                    {/* Make the root path redirect to login */}
                    <Route path="/" element={<Navigate to="/login" />} /> 
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<EmployeeDashboard />} /> 
                    <Route path="/manager" element={<ManagerDashboard />} /> 
                </Routes>
            </div>
        </Router>
    );
}

export default App;