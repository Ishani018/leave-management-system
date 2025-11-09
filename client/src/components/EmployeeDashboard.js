import React, { useState, useEffect, useCallback } from 'react'; // <-- ADD useCallback
import axios from 'axios';

const EmployeeDashboard = () => {
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        reason: '',
    });
    const [requests, setRequests] = useState([]);
    const [leaveType, setLeaveType] = useState('Annual');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // FIX: Wrapped in useCallback to create a stable function for dependency array
    const fetchRequests = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // This redirect handles the "No token, authorization denied" UI issue
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
            setError(null);
        } catch (err) {
            console.error(err.response?.data);
            setError(err.response?.data?.msg || 'Failed to fetch requests.');
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('role'); 
                window.location.href = '/login';
            }
        }
    }, [setError, setRequests]); // Depend only on setters

    // Dependency array now includes fetchRequests, but since it uses useCallback, it's safe.
    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]); 

    // FIX: 'onChange' is now correctly used in the JSX inputs below.
    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    // FIX: 'onSubmit' is now correctly used in the JSX form below.
    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);
        try {
            // FIX: Renamed inner formData to requestData to resolve 'no-use-before-define'
            const requestData = { leaveType, ...formData }; 
            
            // FIX: Removed 'const res =' assignment to resolve 'no-unused-vars' warning.
            await axios.post('/api/leave', requestData); 
            
            setSuccess('Leave request submitted successfully.');
            setLeaveType('Annual');
            setFormData({ startDate: '', endDate: '', reason: '' }); 
            fetchRequests(); 
        } catch (err) {
            setError(err.response?.data?.msg || err.message || 'Failed to submit leave request.');
        } finally {
            setLoading(false);
        }
    };

    // The state variables (requests, loading, error, success) are now USED in this JSX:
    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6">Employee Dashboard</h2>

            <h3>Apply for Leave</h3>
            <form onSubmit={onSubmit} className="max-w-lg mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md">
                {loading && <div className="mb-3 text-center font-medium">Loading...</div>}
                {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
                {success && <div className="mb-3 text-sm text-green-600">{success}</div>}

                {/* --- Form Inputs using onChange and onSubmit --- */}
                {/* ... (rest of the form fields using onChange) */}
                {/* Ensure input names match state keys: startDate, endDate, reason */}
                
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
                        <input type="date" name="startDate" value={formData.startDate} onChange={onChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">End Date</label>
                        <input type="date" name="endDate" value={formData.endDate} onChange={onChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium mb-1">Reason (optional)</label>
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

            <hr className="my-8" />
            
            {/* --- My Leave Requests list uses the 'requests' state --- */}
            <h3 className="text-xl font-semibold mb-4">My Leave Requests</h3>
            {requests.length === 0 ? (
                <p>You have no leave requests.</p>
            ) : (
                <ul className="space-y-3">
                    {requests.map((req) => (
                        <li key={req._id} className="p-3 border rounded-md shadow-sm">
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