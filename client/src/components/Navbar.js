// client/src/components/Navbar.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState(null);

    // On component load, check local storage
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            setRole(localStorage.getItem('role'));
        }
    }, []);

    const onLogout = () => {
        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        // Update state
        setIsLoggedIn(false);
        setRole(null);
        // Redirect to login
        window.location.href = '/login';
    };

    return (
        <nav>
            <div className="logo">Leave System</div>
            <ul>
                {isLoggedIn ? (
                    <>
                        {/* Show links based on role */}
                        {role === 'Employee' && (
                            <li>
                                <Link to="/dashboard">Dashboard</Link>
                            </li>
                        )}
                        {role === 'Manager' && (
                            <li>
                                <Link to="/manager">Manager</Link>
                            </li>
                        )}
                        <li>
                            <button onClick={onLogout} className="logout-button">
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        {/* Show these if user is logged out */}
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                        <li>
                            <Link to="/register">Register</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;