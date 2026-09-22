const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Shipment extends Model {
    static associate(models) {
      Shipment.belongsTo(models.Order, { foreignKey: "order_id", as: "order" });
      Shipment.belongsTo(models.DeliveryTimeSlot, { foreignKey: "time_slot_id", as: "timeSlot" });
    }
  }

  Shipment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      order_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      time_slot_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      courier: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      tracking_number: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("pending", "assigned", "picked_up", "in_transit", "delivered", "failed"),
        defaultValue: "pending",
      },
      delivered_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Shipment",
      tableName: "shipments",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  return Shipment;
};
