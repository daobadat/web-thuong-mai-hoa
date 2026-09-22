const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class DeliveryTimeSlot extends Model {
    static associate(models) {
      DeliveryTimeSlot.hasMany(models.Shipment, { foreignKey: "time_slot_id", as: "shipments" });
    }
  }

  DeliveryTimeSlot.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      delivery_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      slot_start: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      slot_end: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      max_capacity: {
        type: DataTypes.INTEGER,
        defaultValue: 20,
      },
      current_bookings: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "DeliveryTimeSlot",
      tableName: "delivery_time_slots",
      timestamps: false,
    }
  );

  return DeliveryTimeSlot;
};
