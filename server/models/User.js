// server/models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Simple role management
    role: { 
        type: String, 
        enum: ['Employee', 'Manager', 'Admin'], 
        default: 'Employee' 
    }
}, { timestamps: true }); // timestamps adds 'createdAt' and 'updatedAt' fields

module.exports = mongoose.model('User', UserSchema);