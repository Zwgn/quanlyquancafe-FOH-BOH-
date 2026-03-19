const authService = require('../services/authService');
const { success, error } = require('../utils/response');
const { generateToken } = require('../utils/jwt');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return error(res, 'Username and password are required', 400);
    }

    const user = await authService.login(username, password);

    if (!user) {
      return error(res, 'Invalid credentials', 401);
    }

    // Generate JWT token
    const token = generateToken({
      id: user.Id,
      username: user.Username,
      role: user.Role
    });

    // Return user data with token
    return success(res, {
      user: {
        id: user.Id,
        username: user.Username,
        role: user.Role
      },
      token
    }, 'Login successful');
  } catch (err) {
    console.error('Login error:', err);
    return error(res, 'Login failed', 500);
  }
};

const me = async (req, res) => {
  try {
    // User info is attached by authMiddleware
    return success(res, {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role
    });
  } catch (err) {
    console.error('Me error:', err);
    return error(res, 'Failed to get user info', 500);
  }
};

module.exports = {
  login,
  me
};
