'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash('123456', 10);

    await queryInterface.bulkInsert('users', [
      {
        id: 'a0000000-0000-0000-0000-000000000001',
        email: 'admin@flowershop.com',
        phone: '0901111111',
        password_hash: passwordHash,
        full_name: 'Quản Trị Viên (Admin)',
        role: 'admin',
        preferred_language: 'vi',
        is_active: true,
        email_verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'a0000000-0000-0000-0000-000000000002',
        email: 'staff@flowershop.com',
        phone: '0902222222',
        password_hash: passwordHash,
        full_name: 'Nhân Viên Shop (Staff)',
        role: 'staff',
        preferred_language: 'vi',
        is_active: true,
        email_verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'a0000000-0000-0000-0000-000000000003',
        email: 'customer@gmail.com',
        phone: '0903333333',
        password_hash: passwordHash,
        full_name: 'Nguyễn Văn Khách',
        role: 'customer',
        preferred_language: 'vi',
        is_active: true,
        email_verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'a0000000-0000-0000-0000-000000000004',
        email: 'kim.minjun@naver.com',
        phone: '0904444444',
        password_hash: passwordHash,
        full_name: 'Kim Min-Jun (김민준)',
        role: 'customer',
        preferred_language: 'ko',
        is_active: true,
        email_verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
