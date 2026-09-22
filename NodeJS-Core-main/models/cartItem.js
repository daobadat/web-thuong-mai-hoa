const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    static associate(models) {
      CartItem.belongsTo(models.Cart, { foreignKey: "cart_id", as: "cart" });
      CartItem.belongsTo(models.Product, { foreignKey: "product_id", as: "product" });
      CartItem.belongsTo(models.ProductVariant, { foreignKey: "variant_id", as: "variant" });
    }
  }

  CartItem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      cart_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      variant_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
      unit_price_snapshot: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "CartItem",
      tableName: "cart_items",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  return CartItem;
};
