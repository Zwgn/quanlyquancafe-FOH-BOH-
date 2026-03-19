const ingredientService = require('../services/ingredientService');
const { success, error } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const ingredients = await ingredientService.getAll();
    return success(res, ingredients);
  } catch (err) {
    console.error('Get ingredients error:', err);
    return error(res, 'Failed to get ingredients', 500);
  }
};

const create = async (req, res) => {
  try {
    const { name, unit, stockQuantity, supplierId } = req.body;

    if (!name || !unit || stockQuantity === undefined || !supplierId) {
      return error(res, 'Name, unit, stockQuantity, and supplierId are required', 400);
    }

    const result = await ingredientService.create(name, unit, stockQuantity, supplierId);
    return success(res, result, 'Ingredient created successfully', 201);
  } catch (err) {
    console.error('Create ingredient error:', err);
    return error(res, 'Failed to create ingredient', 500);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, unit, stockQuantity, supplierId } = req.body;

    if (!name || !unit || stockQuantity === undefined || !supplierId) {
      return error(res, 'Name, unit, stockQuantity, and supplierId are required', 400);
    }

    const result = await ingredientService.update(id, name, unit, stockQuantity, supplierId);
    return success(res, result, 'Ingredient updated successfully');
  } catch (err) {
    console.error('Update ingredient error:', err);
    return error(res, 'Failed to update ingredient', 500);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ingredientService.remove(id);
    return success(res, result, 'Ingredient deleted successfully');
  } catch (err) {
    console.error('Delete ingredient error:', err);
    return error(res, 'Failed to delete ingredient', 500);
  }
};

module.exports = {
  getAll,
  create,
  update,
  remove
};
