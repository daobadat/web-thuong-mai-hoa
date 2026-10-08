'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('orders', 'payment_method', {
      type: Sequelize.STRING(30),
      allowNull: true,
      defaultValue: 'bank_transfer',
      after: 'expires_at'
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('orders', 'payment_method');
  }
};
