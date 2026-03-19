const paymentService = require('../services/paymentService');
const { success, error } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const payments = await paymentService.getAll();
    return success(res, payments);
  } catch (err) {
    console.error('Get payments error:', err);
    return error(res, 'Failed to get payments', 500);
  }
};

const checkout = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentMethod } = req.body;

    if (!paymentMethod) {
      return error(res, 'Payment method is required', 400);
    }

    const result = await paymentService.checkout(orderId, paymentMethod);
    return success(res, result, 'Payment completed successfully', 201);
  } catch (err) {
    console.error('Checkout error:', err);
    return error(res, 'Failed to complete payment', 500);
  }
};

module.exports = {
  getAll,
  checkout
};
