const paymentService = require('../services/paymentService');
const { success, error } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const payments = await paymentService.getAll();
    return success(res, payments);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách thanh toán:', err);
    return error(res, 'Không thể lấy danh sách thanh toán.', 500);
  }
};

const checkout = async (req, res) => {
  const { orderId } = req.params;
  const { paymentMethod } = req.body;

  try {
    if (!orderId) {
      return error(res, 'Mã đơn hàng là bắt buộc.', 400);
    }

    if (!paymentMethod) {
      return error(res, 'Phương thức thanh toán là bắt buộc.', 400);
    }

    const result = await paymentService.checkout(orderId, paymentMethod);
    return success(res, result, 'Thanh toán hoàn tất thành công.', 201);
  } catch (err) {
    console.error('Lỗi khi thanh toán đơn', orderId, ':', err.message || err);
    return error(res, err.message || 'Không thể hoàn tất thanh toán.', 500);
  }
};

module.exports = {
  getAll,
  checkout
};
