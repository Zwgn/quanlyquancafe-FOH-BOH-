const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authMiddleware } = require('../middlewares/auth');

// All payment routes require authentication
router.use(authMiddleware);

router.get('/', paymentController.getAll);

module.exports = router;
