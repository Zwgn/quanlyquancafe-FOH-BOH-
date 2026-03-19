const menuItemIngredientService = require('../services/menuItemIngredientService');
const { success, error } = require('../utils/response');

const getByMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const ingredients = await menuItemIngredientService.getByMenuItem(id);
    return success(res, ingredients);
  } catch (err) {
    console.error('Get menu item ingredients error:', err);
    return error(res, 'Failed to get menu item ingredients', 500);
  }
};

const create = async (req, res) => {
  try {
    const { id } = req.params;
    const { ingredientId, quantity } = req.body;

    if (!ingredientId || !quantity) {
      return error(res, 'IngredientId and quantity are required', 400);
    }

    const result = await menuItemIngredientService.create(id, ingredientId, quantity);
    return success(res, result, 'Recipe created successfully', 201);
  } catch (err) {
    console.error('Create recipe error:', err);
    return error(res, 'Failed to create recipe', 500);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity) {
      return error(res, 'Quantity is required', 400);
    }

    const result = await menuItemIngredientService.update(id, quantity);
    return success(res, result, 'Recipe updated successfully');
  } catch (err) {
    console.error('Update recipe error:', err);
    return error(res, 'Failed to update recipe', 500);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await menuItemIngredientService.remove(id);
    return success(res, result, 'Recipe deleted successfully');
  } catch (err) {
    console.error('Delete recipe error:', err);
    return error(res, 'Failed to delete recipe', 500);
  }
};

module.exports = {
  getByMenuItem,
  create,
  update,
  remove
};
