const express = require('express');
const dotenv = require('dotenv');
// Assuming you have a connection file
const connectDB = require('./config/db'); 
const cors = require('cors'); 

dotenv.config();

// Load routes
const authRoutes = require('./routes/auth');
const leaveRoutes = require('./routes/leave');
// FIX: Load the Manager routes
const managerRoutes = require('./routes/manager'); 

// Connect to Database (Assuming this function is correct)
connectDB(); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/leave', leaveRoutes);

// FIX: Register the Manager routes
app.use('/api/manager', managerRoutes); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));