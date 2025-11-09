// client/src/components/Register.js

import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const { name, email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const newUser = { name, email, password };
            
            const res = await axios.post('/api/auth/register', newUser);
            
            // Save token and role
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            
            alert('Registration Successful! You are now logged in.');

            // *** THIS IS THE FIX ***
            // Redirect based on the role we just received from the server
            if (res.data.role === 'Manager') {
                window.location.href = '/manager';
            } else {
                window.location.href = '/dashboard';
            }

        } catch (err) {
            console.error(err.response.data);
            alert('Registration Failed: ' + (err.response.data.msg || 'Server Error'));
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={name}
                        onChange={onChange}
                        required
                    />
                </div>
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
                        minLength="6" 
                        required
                    />
                </div>
                <input type="submit" value="Register" />
            </form>
        </div>
    );
};

export default Register;