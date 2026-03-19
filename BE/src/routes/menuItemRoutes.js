const express = require('express');
const router = express.Router();
const menuItemController = require('../controllers/menuItemController');
const menuItemIngredientController = require('../controllers/menuItemIngredientController');
const { authMiddleware, requireAdmin } = require('../middlewares/auth');

// Menu Items routes - All staff can view, only admin can modify
router.get('/', menuItemController.getAll);
router.get('/:id', menuItemController.getById);
router.get('/:id/ingredients', menuItemIngredientController.getByMenuItem);

// Admin only routes
router.post('/', authMiddleware, requireAdmin, menuItemController.create);
router.put('/:id', authMiddleware, requireAdmin, menuItemController.update);
router.delete('/:id', authMiddleware, requireAdmin, menuItemController.remove);
router.post('/:id/ingredients', authMiddleware, requireAdmin, menuItemIngredientController.create);

module.exports = router;
