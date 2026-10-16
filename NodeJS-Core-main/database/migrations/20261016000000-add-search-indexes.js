'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addIndex('products', ['is_active'], {
        name: 'idx_products_is_active',
      });
    } catch (err) {
      console.warn('Index idx_products_is_active might already exist:', err.message);
    }

    try {
      await queryInterface.addIndex('product_translations', ['name'], {
        name: 'idx_product_translations_name',
      });
    } catch (err) {
      console.warn('Index idx_product_translations_name might already exist:', err.message);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeIndex('products', 'idx_products_is_active');
    } catch (err) {}
    try {
      await queryInterface.removeIndex('product_translations', 'idx_product_translations_name');
    } catch (err) {}
  },
};
