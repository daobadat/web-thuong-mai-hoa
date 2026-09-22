'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_oauth_accounts', {
      id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      provider: {
        type: Sequelize.ENUM('google', 'facebook'),
        allowNull: false,
      },
      provider_user_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    try {
      await queryInterface.addIndex('user_oauth_accounts', ['provider', 'provider_user_id'], {
        unique: true,
        name: 'user_oauth_accounts_index_0',
      });
    } catch (err) {
      // Ignore index duplicate error if already exists
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_oauth_accounts');
  },
};
