const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserAddress extends Model {
    static associate(models) {
      UserAddress.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    }
  }

  UserAddress.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      address_type: {
        type: DataTypes.ENUM("shipping", "billing"),
        defaultValue: "shipping",
      },
      recipient_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      recipient_phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      address_line: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      ward: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      district: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "UserAddress",
      tableName: "user_addresses",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  return UserAddress;
};
