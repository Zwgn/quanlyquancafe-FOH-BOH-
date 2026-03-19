const express = require('express');
const router = express.Router();
const menuItemIngredientController = require('../controllers/menuItemIngredientController');

// Routes for updating/deleting specific recipe items
router.put('/:id', menuItemIngredientController.update);
router.delete('/:id', menuItemIngredientController.remove);

module.exports = router;
