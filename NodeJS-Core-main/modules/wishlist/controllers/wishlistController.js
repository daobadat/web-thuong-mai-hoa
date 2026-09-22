const wishlistService = require("modules/wishlist/services/wishlistService");
const responseUtils = require("utils/responseUtils");

const wishlistController = {
  index: async (req, res) => {
    try {
      const lang = req.query.lang || "vi";
      const items = await wishlistService.list(req.user.userId, lang);
      return responseUtils.ok(res, items);
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },

  add: async (req, res) => {
    try {
      const { wishlist, created } = await wishlistService.add(req.user.userId, req.params.productId);
      return responseUtils.ok(res, {
        wishlist,
        message: created ? "Product added to wishlist" : "Product already in wishlist",
      });
    } catch (err) {
      if (err.statusCode === 404) return responseUtils.notFound(res);
      return responseUtils.error(res, err.message);
    }
  },

  remove: async (req, res) => {
    try {
      await wishlistService.remove(req.user.userId, req.params.productId);
      return responseUtils.ok(res, { message: "Product removed from wishlist" });
    } catch (err) {
      if (err.statusCode === 404) return responseUtils.notFound(res);
      return responseUtils.error(res, err.message);
    }
  },
};

module.exports = wishlistController;
