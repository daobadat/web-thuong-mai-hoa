'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('languages', [
      { code: 'vi', name: 'Tiếng Việt' },
      { code: 'en', name: 'English' },
      { code: 'ko', name: '한국어' },
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('languages', null, {});
  },
};
