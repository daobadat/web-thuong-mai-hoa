const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.UserAddress, { foreignKey: "user_id", as: "addresses" });
      User.hasMany(models.Order, { foreignKey: "user_id", as: "orders" });
      User.hasMany(models.Cart, { foreignKey: "user_id", as: "carts" });
      User.hasMany(models.ProductReview, { foreignKey: "user_id", as: "reviews" });
      User.hasMany(models.Wishlist, { foreignKey: "user_id", as: "wishlists" });
      User.hasMany(models.Notification, { foreignKey: "user_id", as: "notifications" });
      User.hasMany(models.RefreshToken, { foreignKey: "user_id", as: "refreshTokens" });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      full_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("customer", "staff", "admin"),
        defaultValue: "customer",
        allowNull: false,
      },
      preferred_language: {
        type: DataTypes.STRING(5),
        defaultValue: "vi",
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      email_verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      last_login_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return User;
};
