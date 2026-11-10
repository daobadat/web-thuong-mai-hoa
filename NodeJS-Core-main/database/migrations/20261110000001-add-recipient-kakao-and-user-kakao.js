'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Thêm kakao_id vào users nếu chưa có
    try {
      const tableInfo = await queryInterface.describeTable('users');
      if (!tableInfo.kakao_id) {
        await queryInterface.addColumn('users', 'kakao_id', {
          type: Sequelize.STRING(100),
          allowNull: true,
          after: 'verify_email_token',
        });
      }
    } catch (_) {}

    // 2. Thêm recipient_kakao vào orders nếu chưa có
    try {
      const tableInfo = await queryInterface.describeTable('orders');
      if (!tableInfo.recipient_kakao) {
        await queryInterface.addColumn('orders', 'recipient_kakao', {
          type: Sequelize.STRING(100),
          allowNull: true,
          after: 'recipient_phone',
        });
      }
    } catch (_) {}
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeColumn('orders', 'recipient_kakao');
    } catch (_) {}
    try {
      await queryInterface.removeColumn('users', 'kakao_id');
    } catch (_) {}
  },
};

