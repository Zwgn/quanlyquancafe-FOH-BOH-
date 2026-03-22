const authService = require('../services/authService');
const { success, error } = require('../utils/response');
const { generateToken } = require('../utils/jwt');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return error(res, 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.', 400);
    }

    const user = await authService.login(username, password);

    if (!user) {
      return error(res, 'Tên đăng nhập hoặc mật khẩu không đúng.', 401);
    }

    const userId = user.Id || user.id;
    const usernameValue = user.Username || user.username;
    const roleValue = user.Role || user.role;

    // Generate JWT token
    const token = generateToken({
      id: userId,
      username: usernameValue,
      role: roleValue
    });

    let displayName =
      user.Name ||
      user.name ||
      user.FullName ||
      user.fullName ||
      user.DisplayName ||
      user.displayName ||
      null;

    if (!displayName && userId) {
      displayName = await authService.getDisplayNameByUserId(userId);
    }

    displayName = displayName || usernameValue;

    // Return user data with token
    return success(res, {
      user: {
        id: userId,
        username: usernameValue,
        role: roleValue,
        displayName,
        name: displayName
      },
      token
    }, 'Đăng nhập thành công');
  } catch (err) {
    console.error('Login error:', err);
    return error(res, 'Đăng nhập thất bại', 500);
  }
};

const me = async (req, res) => {
  try {
    let displayName = await authService.getDisplayNameByUserId(req.user.id);
    displayName = displayName || req.user.username;

    // User info is attached by authMiddleware
    return success(res, {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
      displayName,
      name: displayName
    });
  } catch (err) {
    console.error('Lỗi:', err);
    return error(res, 'Lấy thông tin người dùng thất bại.', 500);
  }
};

module.exports = {
  login,
  me
};
