// server/routes/leave.js

const express = require('express');
const router = express.Router();
const LeaveRequest = require('../models/LeaveRequest');
const authMiddleware = require('../middleware/authMiddleware');

// --- CREATE LEAVE REQUEST ---
// Route: POST /api/leave
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    
    const userId = req.user && req.user.id; 

    if (!userId) {
      return res.status(401).json({ msg: 'Not authenticated.' });
    }
    // Check required fields based on the fixed model schema
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
      // ✅ Confirms the field name is 'user'
      user: userId, 
      leaveType,
      startDate: start,
      endDate: end,
      // Sending 'reason' from req.body, which is now optional in schema
      reason: reason || '', 
      status: 'Pending',
    });

    await newRequest.save();
    return res.status(201).json(newRequest);
  } catch (err) {
    console.error('Leave Submission Error:', err);
    return res.status(500).json({ msg: 'Server error occurred during leave submission.' });
  }
});

// --- GET MY LEAVE REQUESTS ---
router.get('/my-requests', authMiddleware, async (req, res) => {
    try {
        // ✅ Querying by 'user' field to match the schema
        const requests = await LeaveRequest.find({ user: req.user.id })
                                           .sort({ createdAt: -1 }); 
        res.json(requests);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;