// server/middleware/adminMiddleware.js

module.exports = function(req, res, next) {
    // We assume authMiddleware has already run
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ msg: 'Access denied: Not an Admin' });
    }
    next();
};