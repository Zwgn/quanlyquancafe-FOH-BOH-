const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authMiddleware } = require('../middlewares/auth');

// All report routes require authentication
router.use(authMiddleware);

router.get('/daily-revenue', reportController.getDailyRevenue);
router.get('/best-selling-items', reportController.getBestSellingItems);
router.get('/low-stock-ingredients', reportController.getLowStockIngredients);

module.exports = router;
