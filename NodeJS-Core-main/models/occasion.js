const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Occasion extends Model {
    static associate(models) {
      Occasion.hasMany(models.OccasionTranslation, { foreignKey: "occasion_id", as: "translations" });
      Occasion.belongsToMany(models.Product, { through: models.ProductOccasion, foreignKey: "occasion_id", as: "products" });
    }
  }

  Occasion.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      slug: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
      },
      fixed_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      is_recurring: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Occasion",
      tableName: "occasions",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  return Occasion;
};
