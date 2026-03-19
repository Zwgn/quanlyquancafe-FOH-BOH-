const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { authMiddleware, requireAdmin } = require('../middlewares/auth');

// All inventory routes require admin access
router.use(authMiddleware);
router.use(requireAdmin);

router.post('/import', inventoryController.importInventory);
router.post('/export', inventoryController.exportInventory);

module.exports = router;
