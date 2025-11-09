// client/src/components/ManagerDashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManagerDashboard = () => {
    // State to store ALL leave requests
    const [allRequests, setAllRequests] = useState([]);

    // Function to fetch ALL requests
    const fetchAllRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Not authorized');
                window.location.href = '/login';
                return;
            }
            const config = {
                headers: {
                    'x-auth-token': token,
                },
            };
            // Fetches ALL requests from the manager endpoint
            const res = await axios.get('/api/manager/all-requests', config);
            setAllRequests(res.data);
        } catch (err) {
            console.error(err.response.data);
            if (err.response.status === 403) {
                alert('Access denied: You are not a Manager.');
                window.location.href = '/dashboard'; 
            }
            if (err.response.status === 401) {
                alert('Session expired. Please log in again.');
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                window.location.href = '/login';
            }
        }
    };

    // Fetch data when the component loads
    useEffect(() => {
        fetchAllRequests();
    }, []);

    // Function to handle approving or rejecting
    const handleUpdateStatus = async (id, newStatus) => {
        if (!window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} this request?`)) {
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'x-auth-token': token,
                },
            };
            const body = { status: newStatus };
            // Makes the PUT request to update the status
            await axios.put(`/api/manager/request/${id}`, body, config);
            alert(`Request ${newStatus}`);
            fetchAllRequests(); // Re-fetches the list to show the change
        } catch (err) {
            console.error(err.response.data);
            alert('Failed to update status.');
        }
    };

    return (
        <div>
            <h2>Manager Dashboard</h2>

            {/* --- NOTE: THE "APPLY FOR LEAVE" FORM IS REMOVED --- */}

            {/* --- THIS LIST SHOWS ALL REQUESTS FROM ALL EMPLOYEES --- */}
            <h3>All Leave Requests</h3>
            
            {allRequests.length === 0 ? (
                <p>No leave requests found.</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {allRequests.map((req) => (
                        <li key={req._id} className="request-item">
                            {/* Shows which user made the request */}
                            <strong>User:</strong> {req.user.name} ({req.user.email})<br /> 
                            <strong>Reason:</strong> {req.reason}<br />
                            <strong>From:</strong> {new Date(req.startDate).toLocaleDateString()}<br />
                            <strong>To:</strong> {new Date(req.endDate).toLocaleDateString()}<br />
                            <strong>Status:</strong> 
                            <span className={`status-${req.status.toLowerCase()}`}>
                                {req.status}
                            </span>
                            <br /><br />

                            {/* --- APPROVE/REJECT BUTTONS --- */}
                            {/* Only show buttons if the request is still 'Pending' */}
                            {req.status === 'Pending' && (
                                <div>
                                    <button 
                                        onClick={() => handleUpdateStatus(req._id, 'Approved')}
                                        className="btn-approve"
                                    >
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => handleUpdateStatus(req._id, 'Rejected')}
                                        className="btn-reject"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ManagerDashboard;