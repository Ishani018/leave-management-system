// server/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Check for standard Authorization header first
    let token = req.header('Authorization');

    if (token && token.startsWith('Bearer ')) {
        // Extract token from 'Bearer <token>' string
        token = token.slice(7, token.length).trimLeft(); 
    } else {
        // Fallback to non-standard 'x-auth-token' header
        token = req.header('x-auth-token'); 
    }

    // 2. Check if no token
    if (!token) {
        // This is the error you are currently seeing
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // 3. Verify token
    try {
        // FIX: The payload in auth.js is `{ id, role }`, so destructure accordingly.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add the decoded payload (user's ID and role) to the request object
        // The decoded payload is { id: user._id, role: user.role } from auth.js
        req.user = decoded; 
        next(); // Call the next middleware or route
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};