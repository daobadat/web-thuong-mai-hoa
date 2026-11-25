const { User, UserAddress } = require("models");
const bcrypt = require("bcryptjs");

const userService = {
  updateProfile: async (userId, data) => {
    const user = await User.findByPk(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    if (data.full_name) user.full_name = data.full_name;
    if (data.phone !== undefined) user.phone = data.phone;
    if (data.preferred_language) user.preferred_language = data.preferred_language;
    if (data.avatar_url !== undefined) user.avatar_url = data.avatar_url;

    try {
      await user.save();
    } catch (saveErr) {
      const { sequelize } = require("models");
      if (sequelize && (saveErr.original?.code === "ER_BAD_FIELD_ERROR" || String(saveErr).includes("field list") || String(saveErr).includes("kakao_id") || String(saveErr).includes("avatar_url"))) {
        try {
          await sequelize.query("ALTER TABLE `users` ADD COLUMN `kakao_id` varchar(100) NULL");
        } catch (_) {}
        try {
          await sequelize.query("ALTER TABLE `users` ADD COLUMN `avatar_url` MEDIUMTEXT NULL AFTER `full_name`");
        } catch (_) {}
        await user.save();
      } else {
        throw saveErr;
      }
    }

    const userObj = user.toJSON();
    delete userObj.password_hash;
    return userObj;
  },

  changePassword: async (userId, data) => {
    const user = await User.findByPk(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    
    // Check old password
    const isMatch = await bcrypt.compare(data.old_password, user.password_hash);
    if (!isMatch) {
      const error = new Error("Old password is incorrect");
      error.statusCode = 400;
      throw error;
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(data.new_password, salt);
    await user.save();
    
    return true;
  },

  listAddresses: async (userId) => {
    return await UserAddress.findAll({ where: { user_id: userId } });
  },

  addAddress: async (userId, data) => {
    if (data.is_default) {
      await UserAddress.update({ is_default: false }, { where: { user_id: userId } });
    }

    const address = await UserAddress.create({
      user_id: userId,
      address_type: data.address_type || "shipping",
      recipient_name: data.recipient_name,
      recipient_phone: data.recipient_phone,
      address_line: data.address_line,
      ward: data.ward || "",
      district: data.district,
      city: data.city,
      is_default: data.is_default || false,
    });

    return address;
  },

  deleteAddress: async (userId, addressId) => {
    const address = await UserAddress.findOne({ where: { id: addressId, user_id: userId } });
    if (!address) {
      const error = new Error("Address not found");
      error.statusCode = 404;
      throw error;
    }
    await address.destroy();
    return true;
  },

  updateAddress: async (userId, addressId, data) => {
    const address = await UserAddress.findOne({ where: { id: addressId, user_id: userId } });
    if (!address) {
      const error = new Error("Address not found");
      error.statusCode = 404;
      throw error;
    }
    if (data.is_default) {
      await UserAddress.update({ is_default: false }, { where: { user_id: userId } });
    }
    const fields = ["recipient_name","recipient_phone","address_line","ward","district","city","is_default"];
    fields.forEach(f => { if (data[f] !== undefined) address[f] = data[f]; });
    await address.save();
    return address;
  },

  // ── Admin management ──────────────────────────────────────────────────
  listAll: async (query = {}, caller = {}) => {
    const { page = 1, limit = 20, search } = query;
    const where = {};
    if (search) {
      const { Op } = require("sequelize");
      where[Op.or] = [
        { full_name: { [Op.like]: `%${search}%` } },
        { email:     { [Op.like]: `%${search}%` } },
        { phone:     { [Op.like]: `%${search}%` } },
      ];
    }
    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: {
        include: [
          [
            User.sequelize.literal(`(
              SELECT COUNT(*) FROM user_oauth_accounts WHERE user_oauth_accounts.user_id = User.id AND user_oauth_accounts.provider = 'google'
            )`),
            "google_oauth_count",
          ],
          [
            User.sequelize.literal("CASE WHEN password_hash IS NULL THEN 1 ELSE 0 END"),
            "has_no_password",
          ],
        ],
        exclude: ["password_hash"],
      },
      order: [["created_at", "DESC"]],
      limit: Number(limit),
      offset,
    });

    const isStaffCaller = caller && caller.role !== 'admin';

    const data = rows.map((u) => {
      const item = u.toJSON ? u.toJSON() : u;
      const isGoogle = Number(item.google_oauth_count) > 0 || item.has_no_password === 1;

      // Nếu tài khoản nhân viên vào xem, không hiện email của quản trị viên (admin)
      if (isStaffCaller && item.role === 'admin') {
        item.email = '****** (Bảo mật)';
      }

      return {
        ...item,
        auth_provider: isGoogle ? "google" : "local",
        is_google: isGoogle,
      };
    });

    return { total: count, page: Number(page), limit: Number(limit), data };
  },

  findById: async (id) => {
    const user = await User.findByPk(id, { attributes: { exclude: ["password_hash"] } });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    return user;
  },

  createUser: async (data, caller = {}) => {
    const bcrypt = require("bcryptjs");

    // Nhân viên chỉ được tạo tài khoản khách hàng, không được tạo admin hoặc staff
    if (caller.role !== 'admin' && data.role && data.role !== 'customer') {
      const error = new Error("Nhân viên chỉ có quyền tạo tài khoản khách hàng");
      error.statusCode = 403;
      throw error;
    }

    const exists = await User.findOne({ where: { email: data.email } });
    if (exists) {
      const error = new Error("Email already in use");
      error.statusCode = 400;
      throw error;
    }
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(data.password || "123456", salt);
    const user = await User.create({
      email:      data.email,
      full_name:  data.full_name || "",
      phone:      data.phone || "",
      role:       caller.role === 'admin' ? (data.role || "customer") : "customer",
      password_hash,
    });
    const result = user.toJSON();
    delete result.password_hash;
    return result;
  },

  updateUser: async (id, data, caller = {}) => {
    const user = await User.findByPk(id);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // Nhân viên chỉ được chỉnh sửa thông tin khách hàng, không được sửa admin hoặc nhân viên khác
    if (caller.role !== 'admin' && user.role !== 'customer') {
      const error = new Error("Nhân viên chỉ có quyền xem và chỉnh sửa thông tin khách hàng");
      error.statusCode = 403;
      throw error;
    }

    // Chỉ có quản trị viên mới được phép chỉnh sửa vai trò
    if (caller.role !== 'admin' && data.role !== undefined && data.role !== user.role) {
      const error = new Error("Chỉ có quản trị viên mới được phép chỉnh sửa vai trò");
      error.statusCode = 403;
      throw error;
    }

    if (data.full_name !== undefined) user.full_name = data.full_name;
    if (data.phone     !== undefined) user.phone     = data.phone;
    if (caller.role === 'admin' && data.role !== undefined) user.role = data.role;
    if (caller.role === 'admin' && data.email !== undefined) user.email = data.email;
    await user.save();
    const result = user.toJSON();
    delete result.password_hash;
    return result;
  },

  destroyUser: async (id, caller = {}) => {
    const user = await User.findByPk(id);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // Nhân viên chỉ được xóa tài khoản khách hàng, không được xóa quản trị viên hoặc nhân viên
    if (caller.role !== 'admin' && user.role !== 'customer') {
      const error = new Error("Nhân viên chỉ có quyền xóa tài khoản khách hàng");
      error.statusCode = 403;
      throw error;
    }

    await user.destroy();
    return true;
  },
};

module.exports = userService;
