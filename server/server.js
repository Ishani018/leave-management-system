const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// DEFINE ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leave', require('./routes/leave'));
app.use('/api/manager', require('./routes/manager')); // Renamed from 'admin'

// Simple route for testing
app.get('/', (req, res) => {
    res.send('Leave Management Server is running!');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB');
    // Start the server ONLY after successful DB connection
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
})
.catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});