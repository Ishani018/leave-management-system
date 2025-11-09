// client/src/components/EmployeeDashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeDashboard = () => {
    // State for the form (using an object is standard for forms)
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        reason: '',
    });
    // State for the employee's own requests
    const [requests, setRequests] = useState([]);
    const [leaveType, setLeaveType] = useState('Annual');
    // Removed unused individual state variables: startDate, endDate, reason
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Not authorized, please login.');
                window.location.href = '/login'; 
                return;
            }
            const config = {
                headers: {
                    'x-auth-token': token,
                },
            };
            // Fetches ONLY the logged-in user's requests
            const res = await axios.get('/api/leave/my-requests', config);
            setRequests(res.data);
        } catch (err) {
            console.error(err.response?.data || err.message);
            if (err.response?.status === 401) {
                alert('Session expired. Please log in again.');
                localStorage.removeItem('token');
                localStorage.removeItem('role'); 
                window.location.href = '/login';
            }
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []); 

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    // This is the form submission handler
    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);
        try {
            // Build the payload using the current leaveType and the formData state object
            const payload = { leaveType, ...formData };
            
            // FIX 1: Removed 'const res =' assignment to fix 'no-unused-vars' warning
            await axios.post('/api/leave', payload); 
            
            setSuccess('Leave request submitted successfully.');
            
            // Reset form states
            setLeaveType('Annual');
            setFormData({ startDate: '', endDate: '', reason: '' }); 
            
            fetchRequests(); // Re-fetches to show the new request
        } catch (err) {
            setError(err.response?.data?.msg || err.message || 'Failed to submit leave request.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Employee Dashboard</h2>

            {/* --- THIS FORM IS FOR THE EMPLOYEE --- */}
            <h3>Apply for Leave</h3>
            <form onSubmit={onSubmit} className="max-w-lg mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md">
                {loading && <div className="mb-3 text-center font-medium">Loading...</div>}
                {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
                {success && <div className="mb-3 text-sm text-green-600">{success}</div>}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Leave Type</label>
                        <select value={leaveType} onChange={e => setLeaveType(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option>Annual</option>
                            <option>Sick</option>
                            <option>Personal</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Start Date</label>
                        {/* Input names match keys in the formData state object */}
                        <input type="date" name="startDate" value={formData.startDate} onChange={onChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">End Date</label>
                         {/* Input names match keys in the formData state object */}
                        <input type="date" name="endDate" value={formData.endDate} onChange={onChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium mb-1">Reason (optional)</label>
                         {/* Input names match keys in the formData state object */}
                        <textarea name="reason" value={formData.reason} onChange={onChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" rows="3" />
                    </div>
                </div>

                <div className="mt-4">
                    <button type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">
                        Submit Leave Request
                    </button>
                </div>
            </form>

            <hr />
            {/* --- THIS LIST SHOWS ONLY THE EMPLOYEE'S REQUESTS --- */}
            <h3>My Leave Requests</h3>
            {requests.length === 0 ? (
                <p>You have no leave requests.</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {requests.map((req) => (
                        <li key={req._id} className="request-item" style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>
                            <strong>Type:</strong> {req.leaveType}<br />
                            <strong>Reason:</strong> {req.reason}<br />
                            <strong>From:</strong> {new Date(req.startDate).toLocaleDateString()}<br />
                            <strong>To:</strong> {new Date(req.endDate).toLocaleDateString()}<br />
                            <strong>Status:</strong> 
                            <span 
                                className={`status-${req.status.toLowerCase()}`}
                                style={{ 
                                    fontWeight: 'bold', 
                                    marginLeft: '5px', 
                                    color: req.status === 'Approved' ? 'green' : req.status === 'Rejected' ? 'red' : 'orange'
                                }}
                            >
                                {req.status}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default EmployeeDashboard;