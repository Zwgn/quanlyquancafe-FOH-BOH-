const roleService = require('../services/roleService');
const { success, error } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const roles = await roleService.getAll();
    return success(res, roles);
  } catch (err) {
    console.error('Get roles error:', err);
    return error(res, 'Failed to get roles', 500);
  }
};

const create = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return error(res, 'Name is required', 400);
    }

    const result = await roleService.create(name);
    return success(res, result, 'Role created successfully', 201);
  } catch (err) {
    console.error('Create role error:', err);
    return error(res, 'Failed to create role', 500);
  }
};

module.exports = {
  getAll,
  create
};
