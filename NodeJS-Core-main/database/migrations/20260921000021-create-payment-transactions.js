'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payment_transactions', {
      id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        primaryKey: true,
      },
      order_id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      payment_method: {
        type: Sequelize.ENUM('vnpay', 'momo', 'zalopay', 'stripe', 'bank_transfer', 'cod'),
        allowNull: false,
      },
      provider_transaction_id: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: 'VND',
      },
      status: {
        type: Sequelize.ENUM('initiated', 'pending', 'success', 'failed', 'refunded'),
        allowNull: false,
        defaultValue: 'initiated',
      },
      raw_response: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('payment_transactions');
  },
};
