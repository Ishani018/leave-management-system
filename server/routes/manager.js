const express = require('express');
const router = express.Router();
const LeaveRequest = require('../models/LeaveRequest');
const { protect } = require('../middleware/authMiddleware'); 
const { isManager } = require('../middleware/managerMiddleware'); 

// @route   GET /api/manager/requests
// @desc    Get all PENDING leave requests for review
// @access  Private/Manager
router.get('/requests', protect, isManager, async (req, res) => {
    try {
        const requests = await LeaveRequest.find({ status: 'Pending' })
            // FIX: Must use 'user' here, as confirmed by the save logic in leave.js.
            // This prevents a server crash during population.
            .populate('user', 'name email') 
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/manager/requests/:id
// @desc    Approve or Reject a leave request
// @access  Private/Manager
router.put('/requests/:id', protect, isManager, async (req, res) => {
    const { status } = req.body; 

    if (!['Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({ msg: 'Invalid status provided.' });
    }

    try {
        let request = await LeaveRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ msg: 'Leave request not found' });
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