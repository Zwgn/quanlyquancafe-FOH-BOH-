const express = require('express');
const router = express.Router();
const orderItemController = require('../controllers/orderItemController');

// Routes for updating/deleting specific order items
router.put('/:id', orderItemController.update);
router.delete('/:id', orderItemController.remove);
router.patch('/:id/status', orderItemController.updateStatus);

module.exports = router;
