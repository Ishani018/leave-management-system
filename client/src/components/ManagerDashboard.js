import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const ManagerDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getAuthHeaders = useCallback(() => ({
        headers: {
            'x-auth-token': localStorage.getItem('token'),
        },
    }), []);

    // FIX 1: Wrapped in useCallback to create a stable dependency for useEffect
    const fetchRequests = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                 window.location.href = '/login';
                 return;
            }
            // Fetches all PENDING requests using the manager API endpoint
            const res = await axios.get('/api/manager/requests', getAuthHeaders());
            setRequests(res.data);
        } catch (err) {
            console.error(err.response?.data);
            const errMsg = err.response?.data?.msg || 'Failed to fetch requests.';
            setError(errMsg);
            setRequests([]);
            // Handle unauthorized access by redirecting
            if (err.response?.status === 401 || err.response?.status === 403) {
                 localStorage.removeItem('token');
                 localStorage.removeItem('role');
                 // window.location.href = '/login'; // Let the App.js handle this redirect
            }
        } finally {
            setLoading(false);
        }
    }, [setRequests, setError, setLoading, getAuthHeaders]); 

    // FIX 2: 'handleAction' is now correctly used in the JSX below.
    const handleAction = async (id, status) => {
        try {
            // Optimistic UI update: remove the processed request immediately
            setRequests(requests.filter(req => req._id !== id));
            
            // Send PUT request to update status
            await axios.put(`/api/manager/requests/${id}`, { status }, getAuthHeaders());
            
            alert(`Leave request ${status} successfully!`);

        } catch (err) {
            console.error(err.response?.data);
            alert(err.response?.data?.msg || `Failed to ${status.toLowerCase()} request.`);
            // Fetch again on error to restore the item if the server failed
            fetchRequests(); 
        }
    };

    // useEffect now safely uses fetchRequests (which is stable)
    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role === 'Manager') {
            fetchRequests();
        } else {
            // Show error if role check fails locally
            setError("Access denied. Only Managers can view this dashboard.");
            setLoading(false);
        }
    }, [fetchRequests]);

    if (loading) return <div className="text-center p-6">Loading pending requests...</div>;
    // The requests, loading, and error states are used here:
    if (error && requests.length === 0) return <div className="text-red-600">Error: {error}</div>;

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6">Manager Dashboard</h2>
            
            <h3>Pending Leave Requests ({requests.length})</h3>

            {requests.length === 0 ? (
                <p>No pending leave requests require your attention.</p>
            ) : (
                <ul className="space-y-4">
                    {requests.map((req) => (
                        <li key={req._id} className="p-4 border border-yellow-400 bg-yellow-50 rounded-lg shadow-md">
                            <p><strong>Employee:</strong> {req.user?.name || 'Unknown'}</p>
                            <p><strong>Email:</strong> {req.user?.email || 'N/A'}</p>
                            <p><strong>Type:</strong> {req.leaveType}</p>
                            <p><strong>Reason:</strong> {req.reason || '(Not provided)'}</p>
                            <p><strong>Dates:</strong> {new Date(req.startDate).toLocaleDateString()} to {new Date(req.endDate).toLocaleDateString()}</p>
                            
                            <div className="mt-3 space-x-2">
                                {/* FIX 2: handleAction is used on these buttons */}
                                <button
                                    onClick={() => handleAction(req._id, 'Approved')}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleAction(req._id, 'Rejected')}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                                    Reject
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ManagerDashboard;