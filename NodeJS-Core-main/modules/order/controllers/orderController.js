const orderService = require("modules/order/services/orderService");
const responseUtils = require("utils/responseUtils");

const orderController = {
  checkout: async (req, res) => {
    try {
      const userId = req.user.userId;
      const order = await orderService.checkout(userId, req.body);
      return responseUtils.ok(res, order);
    } catch (err) {
      if (err.statusCode === 400) return responseUtils.invalidated(res, { message: err.message });
      return responseUtils.error(res, err.message);
    }
  },

  index: async (req, res) => {
    try {
      const orders = await orderService.listAllOrders(req.query);
      return responseUtils.ok(res, orders);
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },

  userOrders: async (req, res) => {
    try {
      const userId = req.user.userId;
      const orders = await orderService.listUserOrders(userId, req.query);
      return responseUtils.ok(res, orders);
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },

  show: async (req, res) => {
    try {
      const userId = req.user.role === "admin" || req.user.role === "staff" ? null : req.user.userId;
      const order = await orderService.getOrderById(req.params.id, userId);
      if (!order) return responseUtils.notFound(res);
      return responseUtils.ok(res, order);
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },

  updateStatus: async (req, res) => {
    try {
      const changedById = req.user.userId;
      const order = await orderService.updateStatus(
        req.params.id,
        req.body.status,
        changedById,
        req.body.note || null
      );
      return responseUtils.ok(res, order);
    } catch (err) {
      if (err.statusCode === 404) return responseUtils.notFound(res);
      return responseUtils.error(res, err.message);
    }
  },

  getDeliverySlots: async (req, res) => {
    try {
      const slots = await orderService.getDeliverySlots(req.query);
      return responseUtils.ok(res, slots);
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },
};

module.exports = orderController;

