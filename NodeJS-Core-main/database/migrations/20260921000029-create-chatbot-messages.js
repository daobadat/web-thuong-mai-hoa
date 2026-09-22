'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('chatbot_messages', {
      id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        primaryKey: true,
      },
      conversation_id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        references: {
          model: 'chatbot_conversations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      role: {
        type: Sequelize.ENUM('user', 'assistant', 'system'),
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    try {
      await queryInterface.addIndex('chatbot_messages', ['conversation_id', 'created_at'], {
        name: 'idx_chatbot_messages_conv_created',
      });
    } catch (err) {}
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('chatbot_messages');
  },
};
