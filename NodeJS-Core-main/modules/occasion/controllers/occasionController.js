const occasionService = require("modules/occasion/services/occasionService");
const responseUtils = require("utils/responseUtils");

const occasionController = {
  index: async (req, res) => {
    try {
      const lang = req.query.lang || "vi";
      const occasions = await occasionService.list(lang);
      return responseUtils.ok(res, occasions);
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },

  show: async (req, res) => {
    try {
      const lang = req.query.lang || "vi";
      const occasion = await occasionService.getById(req.params.id, lang);
      if (!occasion) return responseUtils.notFound(res);
      return responseUtils.ok(res, occasion);
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },

  create: async (req, res) => {
    try {
      const result = await occasionService.create(req.body);
      return responseUtils.ok(res, result);
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },

  update: async (req, res) => {
    try {
      const result = await occasionService.update(req.params.id, req.body);
      return responseUtils.ok(res, result);
    } catch (err) {
      if (err.statusCode === 404) return responseUtils.notFound(res);
      return responseUtils.error(res, err.message);
    }
  },

  destroy: async (req, res) => {
    try {
      await occasionService.delete(req.params.id);
      return responseUtils.ok(res, { message: "Occasion deleted successfully" });
    } catch (err) {
      if (err.statusCode === 404) return responseUtils.notFound(res);
      return responseUtils.error(res, err.message);
    }
  },
};

module.exports = occasionController;
