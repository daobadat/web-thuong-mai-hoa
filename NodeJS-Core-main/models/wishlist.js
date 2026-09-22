const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    static associate(models) {
      Wishlist.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
      Wishlist.belongsTo(models.Product, { foreignKey: "product_id", as: "product" });
    }
  }

  Wishlist.init(
    {
      user_id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      product_id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "Wishlist",
      tableName: "wishlists",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  return Wishlist;
};
