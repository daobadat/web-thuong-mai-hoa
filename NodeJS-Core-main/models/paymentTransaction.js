const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PaymentTransaction extends Model {
    static associate(models) {
      PaymentTransaction.belongsTo(models.Order, { foreignKey: "order_id", as: "order" });
    }
  }

  PaymentTransaction.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      order_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      payment_method: {
        type: DataTypes.ENUM("vnpay", "momo", "zalopay", "stripe", "bank_transfer", "cod"),
        allowNull: false,
      },
      provider_transaction_id: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(3),
        defaultValue: "VND",
      },
      status: {
        type: DataTypes.ENUM("initiated", "pending", "success", "failed", "refunded"),
        defaultValue: "initiated",
      },
      raw_response: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "PaymentTransaction",
      tableName: "payment_transactions",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  return PaymentTransaction;
};
