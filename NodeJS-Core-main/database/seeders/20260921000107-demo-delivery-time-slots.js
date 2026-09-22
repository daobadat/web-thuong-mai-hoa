'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const today = new Date().toISOString().split('T')[0];

    await queryInterface.bulkInsert('delivery_time_slots', [
      {
        id: 'slot0000-0000-0000-0000-000000000001',
        delivery_date: today,
        slot_start: '08:00:00',
        slot_end: '12:00:00',
        max_capacity: 20,
        current_bookings: 3,
      },
      {
        id: 'slot0000-0000-0000-0000-000000000002',
        delivery_date: today,
        slot_start: '13:00:00',
        slot_end: '17:00:00',
        max_capacity: 20,
        current_bookings: 5,
      },
      {
        id: 'slot0000-0000-0000-0000-000000000003',
        delivery_date: today,
        slot_start: '18:00:00',
        slot_end: '21:00:00',
        max_capacity: 15,
        current_bookings: 1,
      },
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('delivery_time_slots', null, {});
  },
};
