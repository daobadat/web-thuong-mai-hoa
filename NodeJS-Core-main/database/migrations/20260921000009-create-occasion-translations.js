'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('occasion_translations', {
      occasion_id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'occasions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      language_code: {
        type: Sequelize.STRING(5),
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'languages',
          key: 'code',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('occasion_translations');
  },
};
