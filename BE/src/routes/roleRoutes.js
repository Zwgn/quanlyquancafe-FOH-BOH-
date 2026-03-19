const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { authMiddleware, requireAdmin } = require('../middlewares/auth');

// All role routes require admin access
router.use(authMiddleware);
router.use(requireAdmin);

router.get('/', roleController.getAll);
router.post('/', roleController.create);

module.exports = router;
