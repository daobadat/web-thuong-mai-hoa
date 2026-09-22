const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProductVariant extends Model {
    static associate(models) {
      ProductVariant.belongsTo(models.Product, { foreignKey: "product_id", as: "product" });
    }
  }

  ProductVariant.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      sku: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true,
      },
      variant_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      price_modifier: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
      },
      stock_quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "ProductVariant",
      tableName: "product_variants",
      timestamps: false,
    }
  );

  return ProductVariant;
};
