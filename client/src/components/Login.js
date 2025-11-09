import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
            // NOTE: Assuming your server is running on http://localhost:5000 (default)
            const res = await axios.post('/api/auth/login', { email, password });
            
            // 🔑 FIX 1: Store BOTH the token AND the role in localStorage
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role); 

            // 🌟 NEW: Set the default header globally for Axios
            axios.defaults.headers.common['x-auth-token'] = res.data.token;

            // FIX 2: Redirect to the dashboard which will then route based on role
            navigate('/dashboard'); 
        } catch (err) {
            console.error(err.response?.data);
            setError(err.response?.data?.msg || 'Login failed. Check your credentials.');
            setLoading(false);
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