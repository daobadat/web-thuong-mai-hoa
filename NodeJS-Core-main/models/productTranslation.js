const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProductTranslation extends Model {
    static associate(models) {
      ProductTranslation.belongsTo(models.Product, { foreignKey: "product_id", as: "product" });
    }
  }

  ProductTranslation.init(
    {
      product_id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      language_code: {
        type: DataTypes.STRING(5),
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      care_instructions: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ProductTranslation",
      tableName: "product_translations",
      timestamps: false,
    }
  );

  return ProductTranslation;
};
