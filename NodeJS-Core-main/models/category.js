const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.CategoryTranslation, { foreignKey: "category_id", as: "translations" });
      Category.hasMany(models.Product, { foreignKey: "category_id", as: "products" });
      Category.belongsTo(models.Category, { foreignKey: "parent_id", as: "parent" });
      Category.hasMany(models.Category, { foreignKey: "parent_id", as: "children" });
    }
  }

  Category.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      parent_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      slug: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      display_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Category",
      tableName: "categories",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  return Category;
};
