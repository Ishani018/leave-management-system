// server/routes/leave.js

const express = require('express');
const router = express.Router();
const LeaveRequest = require('../models/LeaveRequest');
const authMiddleware = require('../middleware/authMiddleware');

// --- CREATE LEAVE REQUEST ---
// Endpoint: POST /api/leave
// @desc    Apply for leave
// @access  Private (requires token)
router.post('/api/leave-request', authMiddleware, async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const employeeId = req.user && req.user.id;

    if (!employeeId) {
      return res.status(401).json({ msg: 'Not authenticated.' });
    }
    if (!leaveType || !startDate || !endDate) {
      return res.status(400).json({ msg: 'Missing required fields.' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end) || end < start) {
      return res.status(400).json({ msg: 'Invalid dates.' });
    }

    // simple inclusive day count
    const msPerDay = 24 * 60 * 60 * 1000;
    const days = Math.ceil((end - start) / msPerDay) + 1;

    // TODO: replace with real balance lookup per employee from DB
    const leaveBalance = 10;

    if (days > leaveBalance) {
      return res.status(400).json({ msg: 'Insufficient leave balance.' });
    }

    const newRequest = new LeaveRequest({
      employee: employeeId,
      leaveType,
      startDate: start,
      endDate: end,
      reason,
      status: 'Pending',
    });

    await newRequest.save();
    return res.status(201).json(newRequest);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error.' });
  }
});

// --- GET MY LEAVE REQUESTS ---
// Endpoint: GET /api/leave/my-requests
// @desc    Get all leave requests for the logged-in user
// @access  Private (requires token)
router.get('/my-requests', authMiddleware, async (req, res) => {
    try {
        // Find all requests where the 'user' field matches our token's user ID
        const requests = await LeaveRequest.find({ user: req.user.id })
                                           .sort({ createdAt: -1 }); // Show newest first
        res.json(requests);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;