// Role-based access control middleware
const roleGuard = (allowedRoles) => {
    return (req, res, next) => {
        // Check if user is authenticated (should be called after auth middleware)
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.',
            });
        }

        // Check if user role is allowed
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
            });
        }

        next();
    };
};

module.exports = roleGuard;
