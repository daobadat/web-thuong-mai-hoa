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
};

module.exports = userController;
