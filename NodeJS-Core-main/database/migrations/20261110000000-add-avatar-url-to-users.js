'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('users');
    if (!tableInfo.avatar_url) {
      await queryInterface.addColumn('users', 'avatar_url', {
        type: Sequelize.TEXT('medium'),
        allowNull: true,
        defaultValue: null,
        after: 'full_name',
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('users');
    if (tableInfo.avatar_url) {
      await queryInterface.removeColumn('users', 'avatar_url');
    }
  },
};

