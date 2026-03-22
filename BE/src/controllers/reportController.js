const reportService = require('../services/reportService');
const { success, error } = require('../utils/response');

const getDailyRevenue = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return error(res, 'Ngày là bắt buộc.', 400);
    }

    const report = await reportService.getDailyRevenue(date);
    return success(res, report);
  } catch (err) {
    console.error('Lỗi khi lấy doanh thu hàng ngày:', err);
    return error(res, 'Không thể lấy doanh thu hàng ngày.', 500);
  }
};

const getBestSellingItems = async (req, res) => {
  try {
    const { top = 10 } = req.query;
    const items = await reportService.getBestSellingItems(parseInt(top));
    return success(res, items);
  } catch (err) {
    console.error('Lỗi khi lấy món bán chạy:', err);
    return error(res, 'Không thể lấy món bán chạy.', 500);
  }
};

const getLowStockIngredients = async (req, res) => {
  try {
    const { threshold = 100 } = req.query;
    const ingredients = await reportService.getLowStockIngredients(parseFloat(threshold));
    return success(res, ingredients);
  } catch (err) {
    console.error('Lỗi khi lấy nguyên liệu sắp hết:', err);
    return error(res, 'Không thể lấy nguyên liệu sắp hết.', 500);
  }
};

module.exports = {
  getDailyRevenue,
  getBestSellingItems,
  getLowStockIngredients
};
