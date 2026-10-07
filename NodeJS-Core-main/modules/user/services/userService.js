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
    if (data.phone) user.phone = data.phone;
    if (data.preferred_language) user.preferred_language = data.preferred_language;

    await user.save();

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
  listAll: async (query = {}) => {
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
      attributes: { exclude: ["password_hash"] },
      order: [["created_at", "DESC"]],
      limit: Number(limit),
      offset,
    });
    return { total: count, page: Number(page), limit: Number(limit), data: rows };
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

    // Staff cannot create admin users
    if (caller.role !== 'admin' && data.role === 'admin') {
      const error = new Error("Nhân viên không có quyền tạo tài khoản quản trị viên");
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
      role:       data.role || "customer",
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

    // Staff cannot edit admin users
    if (caller.role !== 'admin' && user.role === 'admin') {
      const error = new Error("Nhân viên không có quyền chỉnh sửa tài khoản quản trị viên");
      error.statusCode = 403;
      throw error;
    }

    // Staff cannot promote anyone to admin
    if (caller.role !== 'admin' && data.role === 'admin') {
      const error = new Error("Nhân viên không có quyền gán vai trò quản trị viên");
      error.statusCode = 403;
      throw error;
    }

    if (data.full_name !== undefined) user.full_name = data.full_name;
    if (data.phone     !== undefined) user.phone     = data.phone;
    if (data.role      !== undefined) user.role      = data.role;
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

    // Staff cannot delete admin users
    if (caller.role !== 'admin' && user.role === 'admin') {
      const error = new Error("Nhân viên không có quyền xóa tài khoản quản trị viên");
      error.statusCode = 403;
      throw error;
    }

    await user.destroy();
    return true;
  },
};

module.exports = userService;
