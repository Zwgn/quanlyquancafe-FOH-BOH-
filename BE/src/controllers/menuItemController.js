const menuItemService = require('../services/menuItemService');
const { success, error } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const menuItems = await menuItemService.getAll();
    return success(res, menuItems);
  } catch (err) {
    console.error('Get menu items error:', err);
    return error(res, 'Failed to get menu items', 500);
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await menuItemService.getById(id);

    if (!menuItem) {
      return error(res, 'Menu item not found', 404);
    }

    return success(res, menuItem);
  } catch (err) {
    console.error('Get menu item error:', err);
    return error(res, 'Failed to get menu item', 500);
  }
};

const create = async (req, res) => {
  try {
    const { name, categoryId, price } = req.body;

    if (!name || !categoryId || !price) {
      return error(res, 'Name, categoryId, and price are required', 400);
    }

    const result = await menuItemService.create(name, categoryId, price);
    return success(res, result, 'Menu item created successfully', 201);
  } catch (err) {
    console.error('Create menu item error:', err);
    return error(res, 'Failed to create menu item', 500);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    if (!name || !price) {
      return error(res, 'Name and price are required', 400);
    }

    const result = await menuItemService.update(id, name, price);
    return success(res, result, 'Menu item updated successfully');
  } catch (err) {
    console.error('Update menu item error:', err);
    return error(res, 'Failed to update menu item', 500);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await menuItemService.remove(id);
    return success(res, result, 'Menu item deleted successfully');
  } catch (err) {
    console.error('Delete menu item error:', err);
    return error(res, 'Failed to delete menu item', 500);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
