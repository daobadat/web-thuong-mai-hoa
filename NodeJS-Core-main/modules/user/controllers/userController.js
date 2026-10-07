const userService = require("modules/user/services/userService");
const responseUtils = require("utils/responseUtils");

const userController = {
  updateProfile: async (req, res) => {
    try {
      const user = await userService.updateProfile(req.user.userId, req.body);
      return responseUtils.ok(res, user);
    } catch (err) {
      if (err.statusCode === 404) return responseUtils.notFound(res);
      return responseUtils.error(res, err.message);
    }
  },

  changePassword: async (req, res) => {
    try {
      await userService.changePassword(req.user.userId, req.body);
      return responseUtils.ok(res, { message: "Password updated successfully" });
    } catch (err) {
      if (err.statusCode === 400) return responseUtils.invalidated(res, { message: err.message });
      if (err.statusCode === 404) return responseUtils.notFound(res);
      return responseUtils.error(res, err.message);
    }
  },

  listAddresses: async (req, res) => {
    try {
      const addresses = await userService.listAddresses(req.user.userId);
      return responseUtils.ok(res, addresses);
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },

  addAddress: async (req, res) => {
    try {
      const address = await userService.addAddress(req.user.userId, req.body);
      return responseUtils.ok(res, address);
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },

  deleteAddress: async (req, res) => {
    try {
      await userService.deleteAddress(req.user.userId, req.params.id);
      return responseUtils.ok(res, { message: "Address deleted successfully" });
    } catch (err) {
      if (err.statusCode === 404) return responseUtils.notFound(res);
      return responseUtils.error(res, err.message);
    }
  },

  updateAddress: async (req, res) => {
    try {
      const address = await userService.updateAddress(req.user.userId, req.params.id, req.body);
      return responseUtils.ok(res, address);
    } catch (err) {
      if (err.statusCode === 404) return responseUtils.notFound(res);
      return responseUtils.error(res, err.message);
    }
  },

  // ── Admin management ──────────────────────────────────────────────────
  index: async (req, res) => {
    try {
      const result = await userService.listAll(req.query);
      return responseUtils.ok(res, result);
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },

  show: async (req, res) => {
    try {
      const user = await userService.findById(req.params.id);
      return responseUtils.ok(res, user);
    } catch (err) {
      if (err.statusCode === 404) return responseUtils.notFound(res);
      return responseUtils.error(res, err.message);
    }
  },

  create: async (req, res) => {
    try {
      const user = await userService.createUser(req.body, req.user);
      return responseUtils.created(res, user);
    } catch (err) {
      if (err.statusCode === 400) return responseUtils.invalidated(res, { message: err.message });
      if (err.statusCode === 403) return responseUtils.forbidden(res, err.message);
      return responseUtils.error(res, err.message);
    }
  },

  update: async (req, res) => {
    try {
      const user = await userService.updateUser(req.params.id, req.body, req.user);
      return responseUtils.ok(res, user);
    } catch (err) {
      if (err.statusCode === 403) return responseUtils.forbidden(res, err.message);
      if (err.statusCode === 404) return responseUtils.notFound(res);
      return responseUtils.error(res, err.message);
    }
  },

  destroy: async (req, res) => {
    try {
      await userService.destroyUser(req.params.id, req.user);
      return responseUtils.ok(res, { message: "User deleted successfully" });
    } catch (err) {
      if (err.statusCode === 403) return responseUtils.forbidden(res, err.message);
      if (err.statusCode === 404) return responseUtils.notFound(res);
      return responseUtils.error(res, err.message);
    }
  },
};

module.exports = userController;
