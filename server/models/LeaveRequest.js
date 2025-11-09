// server/models/LeaveRequest.js

const mongoose = require('mongoose');

const LeaveRequestSchema = new mongoose.Schema({
    // Link to the User model (Employee/Manager) who made the request
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    leaveType: {
        type: String,
        required: true,
        // Restricts possible values to ensure data integrity
        enum: ['Annual', 'Sick', 'Personal'] 
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        // FIX: The reason field must be explicitly optional (by removing 'required: true')
        default: '' // This default is only applied if the field is omitted OR set to undefined
        // You MUST remove 'required: true' here if you want it to be optional.
    },
    status: {
        type: String,
        default: 'Pending',
        // Lifecycle of a request
        enum: ['Pending', 'Approved', 'Rejected'] 
    }
}, { timestamps: true });

module.exports = mongoose.model('LeaveRequest', LeaveRequestSchema);