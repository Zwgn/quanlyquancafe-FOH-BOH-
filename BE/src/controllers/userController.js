const userService = require('../services/userService');
const { success, error } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const users = await userService.getAll();
    return success(res, users);
  } catch (err) {
    console.error('Get users error:', err);
    return error(res, 'Failed to get users', 500);
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getById(id);

    if (!user) {
      return error(res, 'User not found', 404);
    }

    return success(res, user);
  } catch (err) {
    console.error('Get user error:', err);
    return error(res, 'Failed to get user', 500);
  }
};

const create = async (req, res) => {
  try {
    const { username, password, roleId } = req.body;

    if (!username || !password || !roleId) {
      return error(res, 'Username, password, and roleId are required', 400);
    }

    const result = await userService.create(username, password, roleId);
    return success(res, result, 'User created successfully', 201);
  } catch (err) {
    console.error('Create user error:', err);
    return error(res, 'Failed to create user', 500);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, roleId } = req.body;

    if (!username || !password || !roleId) {
      return error(res, 'Username, password, and roleId are required', 400);
    }

    const result = await userService.update(id, username, password, roleId);
    return success(res, result, 'User updated successfully');
  } catch (err) {
    console.error('Update user error:', err);
    return error(res, 'Failed to update user', 500);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userService.remove(id);
    return success(res, result, 'User deleted successfully');
  } catch (err) {
    console.error('Delete user error:', err);
    return error(res, 'Failed to delete user', 500);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
