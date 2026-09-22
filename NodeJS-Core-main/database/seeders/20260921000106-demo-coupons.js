'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const validFrom = new Date();
    const validTo = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    await queryInterface.bulkInsert('coupons', [
      {
        id: 'cp000000-0000-0000-0000-000000000001',
        code: 'WELCOME10',
        discount_type: 'percentage',
        discount_value: 10.00,
        min_order_amount: 200000.00,
        max_discount_amount: 100000.00,
        usage_limit: 100,
        used_count: 5,
        valid_from: validFrom,
        valid_to: validTo,
        is_active: true,
      },
      {
        id: 'cp000000-0000-0000-0000-000000000002',
        code: 'FLOWER2026',
        discount_type: 'fixed_amount',
        discount_value: 50000.00,
        min_order_amount: 500000.00,
        max_discount_amount: 50000.00,
        usage_limit: 50,
        used_count: 2,
        valid_from: validFrom,
        valid_to: validTo,
        is_active: true,
      },
      {
        id: 'cp000000-0000-0000-0000-000000000003',
        code: 'CHUSEOK50',
        discount_type: 'percentage',
        discount_value: 15.00,
        min_order_amount: 1000000.00,
        max_discount_amount: 200000.00,
        usage_limit: 200,
        used_count: 0,
        valid_from: validFrom,
        valid_to: validTo,
        is_active: true,
      },
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('coupons', null, {});
  },
};
