const productService = require("modules/product/services/productService");
const responseUtils = require("utils/responseUtils");

const productController = {
  index: async (req, res) => {
    try {
      const result = await productService.list(req.query);
      return responseUtils.ok(res, result);
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },

  show: async (req, res) => {
    try {
      const lang = req.query.lang || "vi";
      const product = await productService.getById(req.params.id, lang);
      if (!product) {
        return responseUtils.notFound(res);
      }
      return responseUtils.ok(res, product);
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },

  create: async (req, res) => {
    try {
      const result = await productService.create(req.body);
      return responseUtils.ok(res, result);
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },

  update: async (req, res) => {
    try {
      const result = await productService.update(req.params.id, req.body);
      return responseUtils.ok(res, result);
    } catch (err) {
      if (err.statusCode === 404) return responseUtils.notFound(res);
      return responseUtils.error(res, err.message);
    }
  },

  destroy: async (req, res) => {
    try {
      await productService.delete(req.params.id);
      return responseUtils.ok(res, { message: "Product deleted successfully" });
    } catch (err) {
      if (err.statusCode === 404) return responseUtils.notFound(res);
      return responseUtils.error(res, err.message);
    }
  },
};

module.exports = productController;
