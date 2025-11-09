// client/src/components/Login.js

import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault(); 
        
        try {
            const loginData = { email, password };
            
            const res = await axios.post('/api/auth/login', loginData);
            
            // Save token and role
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role); 
            
            alert('Login Successful!');

            // *** THIS IS THE FIX ***
            // Redirect based on the role we just received from the server
            if (res.data.role === 'Manager') {
                window.location.href = '/manager';
            } else {
                window.location.href = '/dashboard';
            }

        } catch (err) {
            console.error(err.response.data);
            alert('Login Failed: ' + (err.response.data.msg || 'Server Error'));
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                    />
                </div>
                <input type="submit" value="Login" />
            </form>
        </div>
    );
};

export default Login;