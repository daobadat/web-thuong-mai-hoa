const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
      Order.belongsTo(models.Coupon, { foreignKey: "coupon_id", as: "coupon" });
      Order.hasMany(models.OrderItem, { foreignKey: "order_id", as: "items" });
      Order.hasMany(models.OrderStatusHistory, { foreignKey: "order_id", as: "statusHistory" });
      Order.hasMany(models.PaymentTransaction, { foreignKey: "order_id", as: "payments" });
      Order.hasOne(models.Shipment, { foreignKey: "order_id", as: "shipment" });
    }
  }

  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      order_number: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      coupon_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(
          "pending",
          "confirmed",
          "processing",
          "ready_for_delivery",
          "out_for_delivery",
          "delivered",
          "cancelled",
          "refunded"
        ),
        defaultValue: "pending",
      },
      payment_status: {
        type: DataTypes.ENUM(
          "unpaid",
          "pending",
          "paid",
          "failed",
          "refunded",
          "partially_refunded"
        ),
        defaultValue: "unpaid",
      },
      subtotal: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      discount_amount: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
      },
      shipping_fee: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
      },
      total_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(3),
        defaultValue: "VND",
      },
      delivery_type: {
        type: DataTypes.ENUM("standard", "scheduled"),
        defaultValue: "standard",
      },
      scheduled_delivery_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      recipient_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      recipient_phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      delivery_address: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      card_message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "orders",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Order;
};
