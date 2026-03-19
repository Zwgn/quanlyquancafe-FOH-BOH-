const supplierService = require('../services/supplierService');
const { success, error } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const suppliers = await supplierService.getAll();
    return success(res, suppliers);
  } catch (err) {
    console.error('Get suppliers error:', err);
    return error(res, 'Failed to get suppliers', 500);
  }
};

const create = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    if (!name || !phone || !address) {
      return error(res, 'Name, phone, and address are required', 400);
    }

    const result = await supplierService.create(name, phone, address);
    return success(res, result, 'Supplier created successfully', 201);
  } catch (err) {
    console.error('Create supplier error:', err);
    return error(res, 'Failed to create supplier', 500);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, address } = req.body;

    if (!name || !phone || !address) {
      return error(res, 'Name, phone, and address are required', 400);
    }

    const result = await supplierService.update(id, name, phone, address);
    return success(res, result, 'Supplier updated successfully');
  } catch (err) {
    console.error('Update supplier error:', err);
    return error(res, 'Failed to update supplier', 500);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await supplierService.remove(id);
    return success(res, result, 'Supplier deleted successfully');
  } catch (err) {
    console.error('Delete supplier error:', err);
    return error(res, 'Failed to delete supplier', 500);
  }
};

module.exports = {
  getAll,
  create,
  update,
  remove
};
