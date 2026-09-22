'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('delivery_time_slots', {
      id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        primaryKey: true,
      },
      delivery_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      slot_start: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      slot_end: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      max_capacity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 20,
      },
      current_bookings: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    });

    try {
      await queryInterface.addIndex('delivery_time_slots', ['delivery_date', 'slot_start', 'slot_end'], {
        unique: true,
        name: 'delivery_time_slots_index_2',
      });
    } catch (err) {}
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('delivery_time_slots');
  },
};
