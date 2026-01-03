const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes - Authentication middleware
 * Verifies JWT token and attaches user to request
 * Usage: router.get('/protected', protect, handlerFunction)
 */
const protect = async (req, res, next) => {
    let token;

    // Check if token exists in Authorization header
    // Expected format: "Bearer <token>"
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Extract token from header
        token = req.headers.authorization.split(' ')[1];
    }

    // If no token found, deny access
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route. Please log in.'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database (exclude password)
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found. Token invalid.'
            });
        }

        // User authenticated, proceed to next middleware/route
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        // Token verification failed
        return res.status(401).json({
            success: false,
            message: 'Not authorized. Token is invalid or expired.'
        });
    }
};

/**
 * Authorize middleware - Role-based access control
 * Use after protect middleware to restrict access based on user roles
 * 
 * Usage: router.delete('/admin', protect, authorize('admin'), handlerFunction)
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        // Check if user has required role
        if (!req.user.role || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role || 'user'}' is not authorized to access this route`
            });
        }
        next();
    };
};

/**
 * Optional authentication - Attach user if token exists
 * Does not block request if no token, but attaches user if valid token provided
 * Useful for routes that work both with and without authentication
 * 
 * Usage: router.get('/public-or-private', optionalAuth, handlerFunction)
 */
const optionalAuth = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        // No token, just continue without user
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        // Invalid token, continue without user
        next();
    }
};

module.exports = { protect, authorize, optionalAuth };
