const categoryService = require("modules/category/services/categoryService");
const responseUtils = require("utils/responseUtils");

const categoryController = {
  index: async (req, res) => {
    try {
      const lang = req.query.lang || "vi";
      const categories = await categoryService.list(lang);
      return responseUtils.ok(res, categories);
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },

  show: async (req, res) => {
    try {
      const lang = req.query.lang || "vi";
      const category = await categoryService.getById(req.params.id, lang);
      if (!category) {
        return responseUtils.notFound(res);
      }
      return responseUtils.ok(res, category);
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },

  create: async (req, res) => {
    try {
      const result = await categoryService.create(req.body);
      return responseUtils.ok(res, result);
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },

  update: async (req, res) => {
    try {
      const result = await categoryService.update(req.params.id, req.body);
      return responseUtils.ok(res, result);
    } catch (err) {
      if (err.statusCode === 404) return responseUtils.notFound(res);
      return responseUtils.error(res, err.message);
    }
  },

  destroy: async (req, res) => {
    try {
      await categoryService.delete(req.params.id);
      return responseUtils.ok(res, { message: "Category deleted successfully" });
    } catch (err) {
      if (err.statusCode === 404) return responseUtils.notFound(res);
      return responseUtils.error(res, err.message);
    }
  },
};

module.exports = categoryController;
