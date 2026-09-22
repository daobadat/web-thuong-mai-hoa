const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Coupon extends Model {
    static associate(models) {
      Coupon.hasMany(models.Order, { foreignKey: "coupon_id", as: "orders" });
    }
  }

  Coupon.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      discount_type: {
        type: DataTypes.ENUM("percentage", "fixed_amount"),
        allowNull: false,
      },
      discount_value: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      min_order_amount: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
      },
      max_discount_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
      },
      usage_limit: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      used_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      valid_from: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      valid_to: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Coupon",
      tableName: "coupons",
      timestamps: false,
    }
  );

  return Coupon;
};
