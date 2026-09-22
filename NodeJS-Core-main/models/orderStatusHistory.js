const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OrderStatusHistory extends Model {
    static associate(models) {
      OrderStatusHistory.belongsTo(models.Order, { foreignKey: "order_id", as: "order" });
      OrderStatusHistory.belongsTo(models.User, { foreignKey: "changed_by", as: "changedBy" });
    }
  }

  OrderStatusHistory.init(
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
        allowNull: false,
      },
      changed_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "OrderStatusHistory",
      tableName: "order_status_history",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  return OrderStatusHistory;
};
