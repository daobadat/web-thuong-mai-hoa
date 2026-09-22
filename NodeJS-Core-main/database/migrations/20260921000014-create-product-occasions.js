'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_occasions', {
      product_id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'products',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
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
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('product_occasions');
  },
};
