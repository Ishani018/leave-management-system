// Renamed from admin.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
// Import the new managerMiddleware
const managerMiddleware = require('../middleware/managerMiddleware'); 
const LeaveRequest = require('../models/LeaveRequest');

// --- GET ALL LEAVE REQUESTS ---
// Endpoint: GET /api/manager/all-requests
router.get('/all-requests', [authMiddleware, managerMiddleware], async (req, res) => {
    try {
        const requests = await LeaveRequest.find()
                                           .populate('user', 'name email')
                                           .sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- UPDATE LEAVE REQUEST STATUS ---
// Endpoint: PUT /api/manager/request/:id
router.put('/request/:id', [authMiddleware, managerMiddleware], async (req, res) => {
    try {
        const { status } = req.body; 
        if (status !== 'Approved' && status !== 'Rejected') {
            return res.status(400).json({ msg: 'Invalid status' });
        }
        let request = await LeaveRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ msg: 'Request not found' });
        }
        request.status = status;
        await request.save();
        res.json(request);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;