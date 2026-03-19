const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');

router.get('/', tableController.getAll);
router.post('/', tableController.create);
router.put('/:id', tableController.update);
router.patch('/:id/status', tableController.updateStatus);

module.exports = router;
