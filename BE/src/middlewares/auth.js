const { verifyToken } = require('../utils/jwt');
const { error } = require('../utils/response');

/**
 * Middleware to verify JWT token
 * Extracts token from Authorization header: Bearer <token>
 */
const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'Access denied. No token provided.', 401);
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return error(res, 'Invalid or expired token', 401);
    }

    // Attach user info to request
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return error(res, 'Authentication failed', 401);
  }
};

/**
 * Middleware to check if user has specific role
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Authentication required', 401);
    }

    if (!roles.includes(req.user.role)) {
      return error(res, 'Access denied. Insufficient permissions.', 403);
    }

    next();
  };
};

/**
 * Middleware to check if user is admin
 */
const requireAdmin = requireRole('Admin');

module.exports = {
  authMiddleware,
  requireRole,
  requireAdmin
};
