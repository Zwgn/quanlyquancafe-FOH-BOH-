const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, requireAdmin } = require('../middlewares/auth');

// All user management routes require authentication and admin role
router.use(authMiddleware);
router.use(requireAdmin);

router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.remove);

module.exports = router;
