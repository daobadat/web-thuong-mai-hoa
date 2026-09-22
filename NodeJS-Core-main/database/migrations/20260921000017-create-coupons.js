'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('coupons', {
      id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        primaryKey: true,
      },
      code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      discount_type: {
        type: Sequelize.ENUM('percentage', 'fixed_amount'),
        allowNull: false,
      },
      discount_value: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      min_order_amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      max_discount_amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
      },
      usage_limit: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      used_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      valid_from: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      valid_to: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('coupons');
  },
};
