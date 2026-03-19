const express = require('express');
const router = express.Router();
const menuCategoryController = require('../controllers/menuCategoryController');

router.get('/', menuCategoryController.getAll);
router.post('/', menuCategoryController.create);
router.put('/:id', menuCategoryController.update);
router.delete('/:id', menuCategoryController.remove);

module.exports = router;
