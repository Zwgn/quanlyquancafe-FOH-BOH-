const { verifyToken } = require('../utils/jwt');
const { error } = require('../utils/response');

/**
 * Middleware xác thực JWT token
 * Lấy token từ Authorization header: Bearer <token>
 */
const authMiddleware = (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'Từ chối truy cập. Không có token.', 401);
    }

    // Tách token
    const token = authHeader.substring(7); // Bỏ tiền tố 'Bearer '

    // Xác thực token
    const decoded = verifyToken(token);

    if (!decoded) {
      return error(res, 'Token không hợp lệ hoặc đã hết hạn.', 401);
    }

    // Gắn thông tin người dùng vào request
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Lỗi middleware xác thực:', err);
    return error(res, 'Xác thực thất bại.', 401);
  }
};

/**
 * Middleware kiểm tra vai trò người dùng
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
 * Middleware kiểm tra quyền quản trị viên
 */
const requireAdmin = requireRole('Admin', 'Quản lý');

module.exports = {
  authMiddleware,
  requireRole,
  requireAdmin
};
