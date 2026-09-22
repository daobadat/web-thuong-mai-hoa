const couponService = require("modules/coupon/services/couponService");
const responseUtils = require("utils/responseUtils");

const couponController = {
  index: async (req, res) => {
    try {
      const coupons = await couponService.list();
      return responseUtils.ok(res, coupons);
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },

  create: async (req, res) => {
    try {
      const coupon = await couponService.create(req.body);
      return responseUtils.ok(res, coupon);
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },

  update: async (req, res) => {
    try {
      const coupon = await couponService.update(req.params.id, req.body);
      return responseUtils.ok(res, coupon);
    } catch (err) {
      if (err.statusCode === 404) return responseUtils.notFound(res);
      return responseUtils.error(res, err.message);
    }
  },

  destroy: async (req, res) => {
    try {
      await couponService.delete(req.params.id);
      return responseUtils.ok(res, { message: "Coupon deleted successfully" });
    } catch (err) {
      if (err.statusCode === 404) return responseUtils.notFound(res);
      return responseUtils.error(res, err.message);
    }
  },

  apply: async (req, res) => {
    try {
      const { code, subtotal } = req.body;
      const result = await couponService.apply(code, subtotal);
      return responseUtils.ok(res, result);
    } catch (err) {
      if (err.statusCode === 400) return responseUtils.invalidated(res, { message: err.message });
      return responseUtils.error(res, err.message);
    }
  },
};

module.exports = couponController;
