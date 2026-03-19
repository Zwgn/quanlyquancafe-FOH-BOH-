const tableService = require('../services/tableService');
const { success, error } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const tables = await tableService.getAll();
    return success(res, tables);
  } catch (err) {
    console.error('Get tables error:', err);
    return error(res, 'Failed to get tables', 500);
  }
};

const create = async (req, res) => {
  try {
    const { name, capacity } = req.body;

    if (!name || !capacity) {
      return error(res, 'Name and capacity are required', 400);
    }

    const result = await tableService.create(name, capacity);
    return success(res, result, 'Table created successfully', 201);
  } catch (err) {
    console.error('Create table error:', err);
    return error(res, 'Failed to create table', 500);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, capacity } = req.body;

    if (!name || !capacity) {
      return error(res, 'Name and capacity are required', 400);
    }

    const result = await tableService.update(id, name, capacity);
    return success(res, result, 'Table updated successfully');
  } catch (err) {
    console.error('Update table error:', err);
    return error(res, 'Failed to update table', 500);
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return error(res, 'Status is required', 400);
    }

    const result = await tableService.updateStatus(id, status);
    return success(res, result, 'Table status updated successfully');
  } catch (err) {
    console.error('Update table status error:', err);
    return error(res, 'Failed to update table status', 500);
  }
};

module.exports = {
  getAll,
  create,
  update,
  updateStatus
};
