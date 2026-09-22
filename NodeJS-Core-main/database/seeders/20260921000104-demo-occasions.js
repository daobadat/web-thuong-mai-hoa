'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const occ1 = 'c0000000-0000-0000-0000-000000000001';
    const occ2 = 'c0000000-0000-0000-0000-000000000002';
    const occ3 = 'c0000000-0000-0000-0000-000000000003';
    const occ4 = 'c0000000-0000-0000-0000-000000000004';
    const occ5 = 'c0000000-0000-0000-0000-000000000005';

    await queryInterface.bulkInsert('occasions', [
      { id: occ1, slug: 'valentine', fixed_date: '2026-02-14', is_recurring: true, is_active: true, created_at: new Date() },
      { id: occ2, slug: 'quoc-te-phu-nu', fixed_date: '2026-03-08', is_recurring: true, is_active: true, created_at: new Date() },
      { id: occ3, slug: 'phu-nu-viet-nam', fixed_date: '2026-10-20', is_recurring: true, is_active: true, created_at: new Date() },
      { id: occ4, slug: 'chuseok', fixed_date: null, is_recurring: true, is_active: true, created_at: new Date() },
      { id: occ5, slug: 'sinh-nhat', fixed_date: null, is_recurring: false, is_active: true, created_at: new Date() },
    ], { ignoreDuplicates: true });

    await queryInterface.bulkInsert('occasion_translations', [
      // Valentine
      { occasion_id: occ1, language_code: 'vi', name: 'Lễ Tình Nhân (Valentine 14/2)', description: 'Hoa hồng đỏ lãng mạn bày tỏ tình yêu sâu sắc' },
      { occasion_id: occ1, language_code: 'en', name: 'Valentine\'s Day', description: 'Romantic red roses expressing deep love' },
      { occasion_id: occ1, language_code: 'ko', name: '발렌타인데이', description: '사랑을 전하는 로맨틱 장미 꽃다발' },
      // 8/3
      { occasion_id: occ2, language_code: 'vi', name: 'Quốc Tế Phụ Nữ 8/3', description: 'Tôn vinh và tri ân những người phụ nữ tuyệt vời' },
      { occasion_id: occ2, language_code: 'en', name: 'International Women\'s Day', description: 'Honoring and appreciating wonderful women' },
      { occasion_id: occ2, language_code: 'ko', name: '세계 여성의 날', description: '여성의 날을 축하하는 아름다운 꽃선물' },
      // 20/10
      { occasion_id: occ3, language_code: 'vi', name: 'Ngày Phụ Nữ Việt Nam 20/10', description: 'Gửi trọn yêu thương đến người phụ nữ Việt Nam' },
      { occasion_id: occ3, language_code: 'en', name: 'Vietnamese Women\'s Day', description: 'Special flowers for Vietnamese Women\'s Day' },
      { occasion_id: occ3, language_code: 'ko', name: '베트남 여성의 날', description: '베트남 여성의 날 기념 꽃선물' },
      // Chuseok
      { occasion_id: occ4, language_code: 'vi', name: 'Tết Trung Thu Hàn Quốc (Chuseok)', description: 'Quà hoa và giỏ trái cây biếu gia đình mùa trung thu' },
      { occasion_id: occ4, language_code: 'en', name: 'Chuseok Korean Thanksgiving', description: 'Traditional Korean harvest festival gifts' },
      { occasion_id: occ4, language_code: 'ko', name: '추석 명절', description: '풍성한 한가위 마음을 담은 고급 꽃바구니' },
      // Sinh nhat
      { occasion_id: occ5, language_code: 'vi', name: 'Kỷ Niệm Sinh Nhật', description: 'Hoa tươi vui tươi mừng tuổi mới' },
      { occasion_id: occ5, language_code: 'en', name: 'Birthday Celebration', description: 'Cheerful flowers for birthday celebrations' },
      { occasion_id: occ5, language_code: 'ko', name: '생일 축하', description: '특별한 생일을 축하하는 꽃선물' },
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('occasion_translations', null, {});
    await queryInterface.bulkDelete('occasions', null, {});
  },
};
