const reviewService = require("modules/review/services/reviewService");
const responseUtils = require("utils/responseUtils");

const reviewController = {
  listByProduct: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await reviewService.listByProduct(req.params.productId, page, limit);
      return responseUtils.ok(res, result);
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },

  create: async (req, res) => {
    try {
      const review = await reviewService.create(req.user.userId, req.body);
      return responseUtils.ok(res, review);
    } catch (err) {
      if (err.statusCode === 400) return responseUtils.invalidated(res, { message: err.message });
      if (err.statusCode === 404) return responseUtils.notFound(res);
      return responseUtils.error(res, err.message);
    }
  },

  destroy: async (req, res) => {
    try {
      const isAdmin = req.user.role === "admin";
      await reviewService.delete(req.user.userId, req.params.id, isAdmin);
      return responseUtils.ok(res, { message: "Review deleted successfully" });
    } catch (err) {
      if (err.statusCode === 404) return responseUtils.notFound(res);
      return responseUtils.error(res, err.message);
    }
  },
};

module.exports = reviewController;
