'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const occValentine  = 'c0000000-0000-0000-0000-000000000001';
    const occPhunu83    = 'c0000000-0000-0000-0000-000000000002';
    const occPhunuVN    = 'c0000000-0000-0000-0000-000000000003';
    const occChuseok    = 'c0000000-0000-0000-0000-000000000004';
    const occSinhNhat   = 'c0000000-0000-0000-0000-000000000005';
    const occKhaiTruong = 'c0000000-0000-0000-0000-000000000006';
    const occWedding    = 'c0000000-0000-0000-0000-000000000007';
    const occCorporate  = 'c0000000-0000-0000-0000-000000000008';

    await queryInterface.bulkInsert('occasions', [
      { id: occValentine,  slug: 'valentine',     fixed_date: '2026-02-14', is_recurring: true,  is_active: true, created_at: new Date() },
      { id: occPhunu83,    slug: 'quoc-te-phu-nu', fixed_date: '2026-03-08', is_recurring: true,  is_active: true, created_at: new Date() },
      { id: occPhunuVN,    slug: 'phu-nu-viet-nam', fixed_date: '2026-10-20', is_recurring: true, is_active: true, created_at: new Date() },
      { id: occChuseok,    slug: 'chuseok',        fixed_date: null,         is_recurring: true,  is_active: true, created_at: new Date() },
      { id: occSinhNhat,   slug: 'sinh-nhat',      fixed_date: null,         is_recurring: false, is_active: true, created_at: new Date() },
      { id: occKhaiTruong, slug: 'khai-truong',    fixed_date: null,         is_recurring: false, is_active: true, created_at: new Date() },
      { id: occWedding,    slug: 'cuoi-hoi',       fixed_date: null,         is_recurring: false, is_active: true, created_at: new Date() },
      { id: occCorporate,  slug: 'doanh-nghiep',   fixed_date: null,         is_recurring: false, is_active: true, created_at: new Date() },
    ], { ignoreDuplicates: true });

    await queryInterface.bulkInsert('occasion_translations', [
      // Valentine
      { occasion_id: occValentine, language_code: 'vi', name: 'Lễ Tình Nhân (Valentine 14/2)', description: 'Hoa hồng đỏ lãng mạn bày tỏ tình yêu sâu sắc' },
      { occasion_id: occValentine, language_code: 'en', name: "Valentine's Day", description: 'Romantic red roses expressing deep love' },
      { occasion_id: occValentine, language_code: 'ko', name: '발렌타인데이 / 화이트데이', description: '사랑을 전하는 로맨틱 장미 꽃다발' },
      // 8/3
      { occasion_id: occPhunu83, language_code: 'vi', name: 'Quốc Tế Phụ Nữ 8/3', description: 'Tôn vinh và tri ân những người phụ nữ tuyệt vời' },
      { occasion_id: occPhunu83, language_code: 'en', name: "International Women's Day", description: 'Honoring and appreciating wonderful women' },
      { occasion_id: occPhunu83, language_code: 'ko', name: '세계 여성의 날', description: '여성의 날을 축하하는 아름다운 꽃선물' },
      // 20/10
      { occasion_id: occPhunuVN, language_code: 'vi', name: 'Ngày Phụ Nữ Việt Nam 20/10', description: 'Gửi trọn yêu thương đến người phụ nữ Việt Nam' },
      { occasion_id: occPhunuVN, language_code: 'en', name: "Vietnamese Women's Day", description: 'Special flowers for Vietnamese Women\'s Day' },
      { occasion_id: occPhunuVN, language_code: 'ko', name: '베트남 여성의 날', description: '베트남 여성의 날 기념 꽃선물' },
      // Chuseok
      { occasion_id: occChuseok, language_code: 'vi', name: 'Tết Trung Thu Hàn Quốc (Chuseok)', description: 'Quà hoa và giỏ trái cây biếu gia đình mùa trung thu' },
      { occasion_id: occChuseok, language_code: 'en', name: 'Chuseok Korean Thanksgiving', description: 'Traditional Korean harvest festival gifts' },
      { occasion_id: occChuseok, language_code: 'ko', name: '추석 명절', description: '풍성한 한가위 마음을 담은 고급 꽃바구니' },
      // Sinh nhật
      { occasion_id: occSinhNhat, language_code: 'vi', name: 'Kỷ Niệm Sinh Nhật', description: 'Hoa tươi vui tươi mừng tuổi mới' },
      { occasion_id: occSinhNhat, language_code: 'en', name: 'Birthday Celebration', description: 'Cheerful flowers for birthday celebrations' },
      { occasion_id: occSinhNhat, language_code: 'ko', name: '생일 축하', description: '특별한 생일을 축하하는 꽃선물' },
      // Khai trương
      { occasion_id: occKhaiTruong, language_code: 'vi', name: 'Khai Trương', description: 'Hoa chúc mừng khai trương, hồng phát' },
      { occasion_id: occKhaiTruong, language_code: 'en', name: 'Grand Opening', description: 'Grand opening celebration flowers and stands' },
      { occasion_id: occKhaiTruong, language_code: 'ko', name: '개업 축하', description: '개업을 축하하는 고급 화환' },
      // Cưới hỏi
      { occasion_id: occWedding, language_code: 'vi', name: 'Cưới Hỏi', description: 'Hoa cầm tay cô dâu và trang trí tiệc cưới' },
      { occasion_id: occWedding, language_code: 'en', name: 'Wedding', description: 'Bridal bouquets and wedding decorations' },
      { occasion_id: occWedding, language_code: 'ko', name: '결혼 / 웨딩', description: '신부 부케와 웨딩 꽃장식' },
      // Doanh nghiệp
      { occasion_id: occCorporate, language_code: 'vi', name: 'Quà Doanh Nghiệp', description: 'Hoa và quà tặng cho đối tác, khách hàng doanh nghiệp' },
      { occasion_id: occCorporate, language_code: 'en', name: 'Corporate Gift', description: 'Flowers and gifts for business partners' },
      { occasion_id: occCorporate, language_code: 'ko', name: '기업 선물', description: '비즈니스 파트너를 위한 고급 꽃 선물' },
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('occasion_translations', null, {});
    await queryInterface.bulkDelete('occasions', null, {});
  },
};
