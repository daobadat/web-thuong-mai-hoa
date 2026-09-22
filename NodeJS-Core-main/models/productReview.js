const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProductReview extends Model {
    static associate(models) {
      ProductReview.belongsTo(models.Product, { foreignKey: "product_id", as: "product" });
      ProductReview.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
      ProductReview.belongsTo(models.OrderItem, { foreignKey: "order_item_id", as: "orderItem" });
    }
  }

  ProductReview.init(
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
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      order_item_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      rating: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 1, max: 5 },
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_verified_purchase: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "ProductReview",
      tableName: "product_reviews",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  return ProductReview;
};
