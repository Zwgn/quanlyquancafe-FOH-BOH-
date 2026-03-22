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
      return error(res, 'Từ chối truy cập. Không có token..', 401);
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return error(res, 'Token không hợp lệ hoặc đã hết hạn.', 401);
    }

    // Attach user info to request
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Lỗi middleware xác thực:', err);
    return error(res, 'Xác thực thất bại.', 401);
  }
};

/**
 * Middleware to check if user has specific role
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Từ chối truy cập. Yêu cầu xác thực.', 401);
    }

    if (!roles.includes(req.user.role)) {
      return error(res, 'Từ chối truy cập. Quyền hạn không đủ.', 403);
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
