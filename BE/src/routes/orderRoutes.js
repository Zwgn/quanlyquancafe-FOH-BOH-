const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const orderItemController = require('../controllers/orderItemController');
const paymentController = require('../controllers/paymentController');
const { authMiddleware } = require('../middlewares/auth');

// All order routes require authentication
router.use(authMiddleware);

// Order routes
router.get('/', orderController.getAll);
router.get('/:id', orderController.getById);
router.post('/', orderController.create);
router.patch('/:id/status', orderController.updateStatus);
router.delete('/:id', orderController.remove);

// Order Items routes
router.post('/:orderId/items', orderItemController.add);

// Payment route
router.post('/:orderId/payment', paymentController.checkout);

module.exports = router;
