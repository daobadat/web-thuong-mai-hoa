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

  forgotPassword: async (email) => {
    const crypto = require("crypto");
    const emailUtils = require("utils/emailUtils");

    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Return success anyway to prevent email enumeration
      return { message: "If that email exists, we sent a password reset link." };
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.reset_password_token = hash;
    user.reset_password_expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    const resetUrl = `${process.env.APP_BASE_URL || "http://localhost:3000"}/auth/reset-password?token=${resetToken}`;

    await emailUtils.sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click the link below to set a new password:</p>
             <p><a href="${resetUrl}">${resetUrl}</a></p>
             <p>This link will expire in 15 minutes.</p>`,
    });

    return { message: "If that email exists, we sent a password reset link." };
  },

  resetPassword: async ({ token, password }) => {
    const crypto = require("crypto");
    const hash = crypto.createHash("sha256").update(token).digest("hex");
    const { Op } = require("sequelize");

    const user = await User.findOne({
      where: {
        reset_password_token: hash,
        reset_password_expires: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      const error = new Error("Token is invalid or has expired");
      error.statusCode = 400;
      throw error;
    }

    const bcrypt = require("bcryptjs");
    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(password, salt);
    user.reset_password_token = null;
    user.reset_password_expires = null;
    await user.save();

    return { message: "Password has been successfully reset" };
  },

  verifyEmail: async (token) => {
    const user = await User.findOne({ where: { verify_email_token: token } });
    if (!user) {
      const error = new Error("Invalid or expired verification token");
      error.statusCode = 400;
      throw error;
    }

    user.email_verified_at = new Date();
    user.verify_email_token = null;
    await user.save();

    return { message: "Email has been successfully verified" };
  },
};

module.exports = authService;
