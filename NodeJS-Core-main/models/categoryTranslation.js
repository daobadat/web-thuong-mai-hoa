const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CategoryTranslation extends Model {
    static associate(models) {
      CategoryTranslation.belongsTo(models.Category, { foreignKey: "category_id", as: "category" });
    }
  }

  CategoryTranslation.init(
    {
      category_id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      language_code: {
        type: DataTypes.STRING(5),
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "CategoryTranslation",
      tableName: "category_translations",
      timestamps: false,
    }
  );

  return CategoryTranslation;
};
