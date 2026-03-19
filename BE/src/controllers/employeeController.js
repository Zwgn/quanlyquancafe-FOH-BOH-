const employeeService = require('../services/employeeService');
const { success, error } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const employees = await employeeService.getAll();
    return success(res, employees);
  } catch (err) {
    console.error('Get employees error:', err);
    return error(res, 'Failed to get employees', 500);
  }
};

const create = async (req, res) => {
  try {
    const { userId, name, phone } = req.body;

    if (!userId || !name || !phone) {
      return error(res, 'UserId, name, and phone are required', 400);
    }

    const result = await employeeService.create(userId, name, phone);
    return success(res, result, 'Employee created successfully', 201);
  } catch (err) {
    console.error('Create employee error:', err);
    return error(res, 'Failed to create employee', 500);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;

    if (!name || !phone) {
      return error(res, 'Name and phone are required', 400);
    }

    const result = await employeeService.update(id, name, phone);
    return success(res, result, 'Employee updated successfully');
  } catch (err) {
    console.error('Update employee error:', err);
    return error(res, 'Failed to update employee', 500);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await employeeService.remove(id);
    return success(res, result, 'Employee deleted successfully');
  } catch (err) {
    console.error('Delete employee error:', err);
    return error(res, 'Failed to delete employee', 500);
  }
};

module.exports = {
  getAll,
  create,
  update,
  remove
};
