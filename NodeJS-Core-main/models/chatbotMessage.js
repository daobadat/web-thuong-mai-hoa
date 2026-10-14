const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ChatbotMessage extends Model {
    static associate(models) {
      ChatbotMessage.belongsTo(models.ChatbotConversation, { foreignKey: "conversation_id", as: "conversation" });
    }
  }

  ChatbotMessage.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      conversation_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("user", "assistant", "system"),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "ChatbotMessage",
      tableName: "chatbot_messages",
      timestamps: false,
    }
  );

  return ChatbotMessage;
};
