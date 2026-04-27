const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { authMiddleware, requireAdmin } = require('../middlewares/auth');
const { success, error } = require('../utils/response');

router.post('/', authMiddleware, requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return error(res, 'Vui lòng chọn file ảnh.', 400);
  }
  const url = `/uploads/${req.file.filename}`;
  return success(res, { url }, 'Upload ảnh thành công.');
});

module.exports = router;
