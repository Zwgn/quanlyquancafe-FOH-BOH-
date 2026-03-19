const menuCategoryService = require('../services/menuCategoryService');
const { success, error } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const categories = await menuCategoryService.getAll();
    return success(res, categories);
  } catch (err) {
    console.error('Get menu categories error:', err);
    return error(res, 'Failed to get menu categories', 500);
  }
};

const create = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return error(res, 'Name is required', 400);
    }

    const result = await menuCategoryService.create(name);
    return success(res, result, 'Menu category created successfully', 201);
  } catch (err) {
    console.error('Create menu category error:', err);
    return error(res, 'Failed to create menu category', 500);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return error(res, 'Name is required', 400);
    }

    const result = await menuCategoryService.update(id, name);
    return success(res, result, 'Menu category updated successfully');
  } catch (err) {
    console.error('Update menu category error:', err);
    return error(res, 'Failed to update menu category', 500);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await menuCategoryService.remove(id);
    return success(res, result, 'Menu category deleted successfully');
  } catch (err) {
    console.error('Delete menu category error:', err);
    return error(res, 'Failed to delete menu category', 500);
  }
};

module.exports = {
  getAll,
  create,
  update,
  remove
};
