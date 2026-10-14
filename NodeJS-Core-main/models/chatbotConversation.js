const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ChatbotConversation extends Model {
    static associate(models) {
      ChatbotConversation.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
      ChatbotConversation.hasMany(models.ChatbotMessage, { foreignKey: "conversation_id", as: "messages" });
    }
  }

  ChatbotConversation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      session_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      language: {
        type: DataTypes.STRING(5),
        defaultValue: "vi",
        allowNull: false,
      },
      started_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      ended_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ChatbotConversation",
      tableName: "chatbot_conversations",
      timestamps: false,
    }
  );

  return ChatbotConversation;
};
