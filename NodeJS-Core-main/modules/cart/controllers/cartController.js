const cartService = require("modules/cart/services/cartService");
const responseUtils = require("utils/responseUtils");

const cartController = {
  index: async (req, res) => {
    try {
      const userId = req.user ? req.user.userId : null;
      const sessionId = req.headers["x-session-id"] || null;
      const lang = req.query.lang || "vi";

      const cart = await cartService.getCart(userId, sessionId, lang);
      return responseUtils.ok(res, cart);
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },

  addItem: async (req, res) => {
    try {
      const userId = req.user ? req.user.userId : null;
      const sessionId = req.headers["x-session-id"] || null;

      const cart = await cartService.addItem(userId, req.body, sessionId);
      return responseUtils.ok(res, cart);
    } catch (err) {
      if (err.statusCode === 404) return responseUtils.notFound(res);
      return responseUtils.error(res, err.message);
    }
  },

  updateItem: async (req, res) => {
    try {
      const userId = req.user ? req.user.userId : null;
      const sessionId = req.headers["x-session-id"] || null;

      const cart = await cartService.updateItem(userId, req.params.itemId, req.body.quantity, sessionId);
      return responseUtils.ok(res, cart);
    } catch (err) {
      if (err.statusCode === 404) return responseUtils.notFound(res);
      return responseUtils.error(res, err.message);
    }
  },

  removeItem: async (req, res) => {
    try {
      const userId = req.user ? req.user.userId : null;
      const sessionId = req.headers["x-session-id"] || null;

      const cart = await cartService.removeItem(userId, req.params.itemId, sessionId);
      return responseUtils.ok(res, cart);
    } catch (err) {
      if (err.statusCode === 404) return responseUtils.notFound(res);
      return responseUtils.error(res, err.message);
    }
  },
};

module.exports = cartController;
