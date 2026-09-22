const notificationService = require("modules/notification/services/notificationService");
const responseUtils = require("utils/responseUtils");

const notificationController = {
  index: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const result = await notificationService.list(req.user.userId, page, limit);
      return responseUtils.ok(res, result);
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },

  markAsRead: async (req, res) => {
    try {
      const notification = await notificationService.markAsRead(req.user.userId, req.params.id);
      return responseUtils.ok(res, notification);
    } catch (err) {
      if (err.statusCode === 404) return responseUtils.notFound(res);
      return responseUtils.error(res, err.message);
    }
  },

  markAllAsRead: async (req, res) => {
    try {
      await notificationService.markAllAsRead(req.user.userId);
      return responseUtils.ok(res, { message: "All notifications marked as read" });
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },

  destroy: async (req, res) => {
    try {
      await notificationService.delete(req.user.userId, req.params.id);
      return responseUtils.ok(res, { message: "Notification deleted" });
    } catch (err) {
      if (err.statusCode === 404) return responseUtils.notFound(res);
      return responseUtils.error(res, err.message);
    }
  },
};

module.exports = notificationController;
