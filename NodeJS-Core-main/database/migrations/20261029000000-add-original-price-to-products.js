'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('products');
    if (!tableInfo.original_price) {
      await queryInterface.addColumn('products', 'original_price', {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
        defaultValue: null,
        after: 'base_price',
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('products');
    if (tableInfo.original_price) {
      await queryInterface.removeColumn('products', 'original_price');
    }
  },
};
