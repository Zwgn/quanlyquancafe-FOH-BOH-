const reportService = require('../services/reportService');
const { success, error } = require('../utils/response');

const getDailyRevenue = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return error(res, 'Date parameter is required', 400);
    }

    const report = await reportService.getDailyRevenue(date);
    return success(res, report);
  } catch (err) {
    console.error('Get daily revenue error:', err);
    return error(res, 'Failed to get daily revenue', 500);
  }
};

const getBestSellingItems = async (req, res) => {
  try {
    const { top = 10 } = req.query;
    const items = await reportService.getBestSellingItems(parseInt(top));
    return success(res, items);
  } catch (err) {
    console.error('Get best selling items error:', err);
    return error(res, 'Failed to get best selling items', 500);
  }
};

const getLowStockIngredients = async (req, res) => {
  try {
    const { threshold = 100 } = req.query;
    const ingredients = await reportService.getLowStockIngredients(parseFloat(threshold));
    return success(res, ingredients);
  } catch (err) {
    console.error('Get low stock ingredients error:', err);
    return error(res, 'Failed to get low stock ingredients', 500);
  }
};

module.exports = {
  getDailyRevenue,
  getBestSellingItems,
  getLowStockIngredients
};
