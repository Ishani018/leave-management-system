const isManager = (req, res, next) => {
    // Assumes the 'protect' middleware has run and attached req.user
    if (!req.user || req.user.role !== 'Manager') {
        // 403 Forbidden is the correct status for role-based access denial
        return res.status(403).json({ msg: 'Access denied. Manager role required.' });
    }

    next();
};

module.exports = { isManager };