import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import setAuthToken from '../utils/setAuthToken'; // <-- Import the new utility

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await axios.post('/api/auth/login', { email, password });
            
            const { token, role } = res.data;
            
            // 1. Store token and role
            localStorage.setItem('token', token);
            localStorage.setItem('role', role); 

            // 2. Set the default header globally using the utility
            setAuthToken(token); // ✅ FIX: Use the utility to set header

            // FIX: Redirect based on the user's role
            if (role === 'Manager') {
                navigate('/manager'); // Redirect manager to manager dashboard
            } else {
                navigate('/dashboard'); // Redirect employee to employee dashboard
            }
        } catch (err) {
            console.error(err.response?.data);
            setError(err.response?.data?.msg || 'Login failed. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
            <form onSubmit={onSubmit}>
                {error && <div className="mb-4 text-sm text-red-600 p-2 bg-red-100 rounded">{error}</div>}
                
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input type="email" name="email" value={email} onChange={onChange} required
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input type="password" name="password" value={password} onChange={onChange} required
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <button type="submit" disabled={loading}
                    className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;