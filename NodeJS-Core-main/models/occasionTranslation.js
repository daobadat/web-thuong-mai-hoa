const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OccasionTranslation extends Model {
    static associate(models) {
      OccasionTranslation.belongsTo(models.Occasion, { foreignKey: "occasion_id", as: "occasion" });
    }
  }

  OccasionTranslation.init(
    {
      occasion_id: {
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
      modelName: "OccasionTranslation",
      tableName: "occasion_translations",
      timestamps: false,
    }
  );

  return OccasionTranslation;
};
