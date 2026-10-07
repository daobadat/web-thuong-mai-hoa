const bcrypt = require("bcryptjs");
const { User } = require("models");
const jwtUtils = require("utils/jwtUtils");

const authService = {
  register: async (data) => {
    const existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) {
      const error = new Error("Email already registered");
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(data.password, salt);

    const newUser = await User.create({
      email: data.email,
      password_hash,
      full_name: data.full_name,
      phone: data.phone || null,
      role: data.role || "customer",
    });

    const token = jwtUtils.sign(newUser.id, newUser.role);
    const refreshToken = jwtUtils.signRefreshToken(newUser.id, newUser.role);

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        phone: newUser.phone,
        role: newUser.role,
        has_password: true,
      },
      token,
      refreshToken,
    };
  },

  login: async ({ email, password }) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    if (!user.is_active) {
      const error = new Error("Account has been disabled");
      error.statusCode = 403;
      throw error;
    }

    // Nếu user tạo qua google không có password
    if (!user.password_hash) {
      const error = new Error("Tài khoản này được đăng nhập bằng Google. Vui lòng đăng nhập bằng Google.");
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    // Update last login
    user.last_login_at = new Date();
    await user.save();

    const token = jwtUtils.sign(user.id, user.role);
    const refreshToken = jwtUtils.signRefreshToken(user.id, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        role: user.role,
        has_password: true,
      },
      token,
      refreshToken,
    };
  },

  getProfile: async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    
    const userObj = user.toJSON();
    userObj.has_password = !!userObj.password_hash;
    delete userObj.password_hash;
    return userObj;
  },
};

module.exports = authService;
