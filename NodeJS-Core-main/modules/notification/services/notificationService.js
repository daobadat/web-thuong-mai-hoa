const { Notification } = require("models");

const notificationService = {
  list: async (userId, page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    const { count, rows } = await Notification.findAndCountAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    return {
      total: count,
      unread: rows.filter((n) => !n.is_read).length,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      notifications: rows,
    };
  },

  markAsRead: async (userId, notificationId) => {
    const notification = await Notification.findOne({
      where: { id: notificationId, user_id: userId },
    });

    if (!notification) {
      const error = new Error("Notification not found");
      error.statusCode = 404;
      throw error;
    }

    notification.is_read = true;
    await notification.save();
    return notification;
  },

  markAllAsRead: async (userId) => {
    await Notification.update(
      { is_read: true },
      { where: { user_id: userId, is_read: false } }
    );
    return true;
  },

  // Utility để tạo notification (dùng nội bộ từ các service khác)
  create: async (userId, type, title, message) => {
    return await Notification.create({
      user_id: userId,
      type,
      title,
      message,
    });
  },

  delete: async (userId, notificationId) => {
    const notification = await Notification.findOne({
      where: { id: notificationId, user_id: userId },
    });

    if (!notification) {
      const error = new Error("Notification not found");
      error.statusCode = 404;
      throw error;
    }

    await notification.destroy();
    return true;
  },
};

module.exports = notificationService;
