'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const cat1 = 'b0000000-0000-0000-0000-000000000001';
    const cat2 = 'b0000000-0000-0000-0000-000000000002';
    const cat3 = 'b0000000-0000-0000-0000-000000000003';
    const cat4 = 'b0000000-0000-0000-0000-000000000004';

    await queryInterface.bulkInsert('categories', [
      { id: cat1, parent_id: null, slug: 'hoa-sinh-nhat', is_active: true, display_order: 1, created_at: new Date() },
      { id: cat2, parent_id: null, slug: 'hoa-khai-truong', is_active: true, display_order: 2, created_at: new Date() },
      { id: cat3, parent_id: null, slug: 'hoa-cuoi', is_active: true, display_order: 3, created_at: new Date() },
      { id: cat4, parent_id: null, slug: 'hoa-chia-buon', is_active: true, display_order: 4, created_at: new Date() },
    ], { ignoreDuplicates: true });

    await queryInterface.bulkInsert('category_translations', [
      // Hoa sinh nhat
      { category_id: cat1, language_code: 'vi', name: 'Hoa Sinh Nhật', description: 'Bó hoa tươi sáng rực rỡ mừng sinh nhật người thân, bạn bè' },
      { category_id: cat1, language_code: 'en', name: 'Birthday Flowers', description: 'Vibrant fresh flowers for birthday celebrations' },
      { category_id: cat1, language_code: 'ko', name: '생일 꽃선물', description: '소중한 분의 생일을 축하하는 아름다운 꽃다발' },
      // Hoa khai truong
      { category_id: cat2, language_code: 'vi', name: 'Hoa Khai Trương', description: 'Kệ hoa sang trọng mừng khai trương, hồng phát' },
      { category_id: cat2, language_code: 'en', name: 'Grand Opening Flowers', description: 'Luxurious flower stands for business openings' },
      { category_id: cat2, language_code: 'ko', name: '개업 축하 화환', description: '사업 번창을 기원하는 품격 있는 축하 화환' },
      // Hoa cuoi
      { category_id: cat3, language_code: 'vi', name: 'Hoa Cưới', description: 'Hoa cầm tay cô dâu và trang trí tiệc cưới tinh tế' },
      { category_id: cat3, language_code: 'en', name: 'Wedding Flowers', description: 'Bridal bouquets and elegant wedding venue flowers' },
      { category_id: cat3, language_code: 'ko', name: '웨딩 부케 및 꽃장식', description: '신부를 위한 부케와 우아한 웨딩 꽃장식' },
      // Hoa chia buon
      { category_id: cat4, language_code: 'vi', name: 'Hoa Chia Buồn', description: 'Vòng hoa viếng kính tiễn người đã khuất' },
      { category_id: cat4, language_code: 'en', name: 'Funeral & Sympathy Flowers', description: 'Respectful sympathy wreaths and funeral arrangements' },
      { category_id: cat4, language_code: 'ko', name: '근조 화환', description: '삼가 고인의 명복을 비는 정성 어린 근조 화환' },
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('category_translations', null, {});
    await queryInterface.bulkDelete('categories', null, {});
  },
};
