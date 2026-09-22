const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProductOccasion extends Model {
    static associate(models) {
      ProductOccasion.belongsTo(models.Product, { foreignKey: "product_id", as: "product" });
      ProductOccasion.belongsTo(models.Occasion, { foreignKey: "occasion_id", as: "occasion" });
    }
  }

  ProductOccasion.init(
    {
      product_id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      occasion_id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "ProductOccasion",
      tableName: "product_occasions",
      timestamps: false,
    }
  );

  return ProductOccasion;
};
