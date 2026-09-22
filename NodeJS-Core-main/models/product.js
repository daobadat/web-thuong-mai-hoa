const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Category, { foreignKey: "category_id", as: "category" });
      Product.hasMany(models.ProductTranslation, { foreignKey: "product_id", as: "translations" });
      Product.hasMany(models.ProductImage, { foreignKey: "product_id", as: "images" });
      Product.hasMany(models.ProductVariant, { foreignKey: "product_id", as: "variants" });
      Product.hasMany(models.CartItem, { foreignKey: "product_id", as: "cartItems" });
      Product.hasMany(models.OrderItem, { foreignKey: "product_id", as: "orderItems" });
      Product.hasMany(models.ProductReview, { foreignKey: "product_id", as: "reviews" });
      Product.hasMany(models.Wishlist, { foreignKey: "product_id", as: "wishlists" });
      Product.belongsToMany(models.Occasion, { through: models.ProductOccasion, foreignKey: "product_id", as: "occasions" });
    }
  }

  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      sku: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      category_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      base_price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(3),
        defaultValue: "VND",
      },
      stock_quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      is_preorder: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      avg_rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0,
      },
      review_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Product;
};
