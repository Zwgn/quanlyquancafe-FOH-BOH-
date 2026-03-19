const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authMiddleware, requireAdmin } = require('../middlewares/auth');

// All employee routes require admin access
router.use(authMiddleware);
router.use(requireAdmin);

router.get('/', employeeController.getAll);
router.post('/', employeeController.create);
router.put('/:id', employeeController.update);
router.delete('/:id', employeeController.remove);

module.exports = router;
