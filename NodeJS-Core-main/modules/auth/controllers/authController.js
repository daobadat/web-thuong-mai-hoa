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

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return responseUtils.invalidated(res, { message: "Email is required" });
      const result = await authService.forgotPassword(email);
      return responseUtils.ok(res, result);
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token, password } = req.body;
      if (!token || !password) return responseUtils.invalidated(res, { message: "Token and password are required" });
      const result = await authService.resetPassword({ token, password });
      return responseUtils.ok(res, result);
    } catch (err) {
      if (err.statusCode === 400) return responseUtils.invalidated(res, { message: err.message });
      return responseUtils.error(res, err.message);
    }
  },

  verifyEmail: async (req, res) => {
    try {
      const { token } = req.query;
      if (!token) return responseUtils.invalidated(res, { message: "Token is required" });
      const result = await authService.verifyEmail(token);
      return responseUtils.ok(res, result);
    } catch (err) {
      if (err.statusCode === 400) return responseUtils.invalidated(res, { message: err.message });
      return responseUtils.error(res, err.message);
    }
  },
};

module.exports = authController;
