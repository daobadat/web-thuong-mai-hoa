const authService = require("modules/auth/services/authService");
const responseUtils = require("utils/responseUtils");

const authController = {
  register: async (req, res) => {
    try {
      const result = await authService.register(req.body);
      return responseUtils.ok(res, result);
    } catch (err) {
      if (err.statusCode === 400) {
        return responseUtils.invalidated(res, { message: err.message });
      }
      return responseUtils.error(res, err.message);
    }
  },

  login: async (req, res) => {
    try {
      const result = await authService.login(req.body);
      return responseUtils.ok(res, result);
    } catch (err) {
      if (err.statusCode === 401) {
        return responseUtils.unauthorized(res, err.message);
      }
      return responseUtils.error(res, err.message);
    }
  },

  me: async (req, res) => {
    try {
      const profile = await authService.getProfile(req.user.userId);
      return responseUtils.ok(res, profile);
    } catch (err) {
      if (err.statusCode === 404) {
        return responseUtils.notFound(res);
      }
      return responseUtils.error(res, err.message);
    }
  },
};

module.exports = authController;
