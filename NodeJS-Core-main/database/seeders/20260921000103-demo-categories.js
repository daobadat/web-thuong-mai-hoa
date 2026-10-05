'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // ── Category IDs ──
    const catBouquet   = 'b0000000-0000-0000-0000-000000000001'; // Bó hoa
    const catStand     = 'b0000000-0000-0000-0000-000000000002'; // Kệ hoa / Chậu lan
    const catBox       = 'b0000000-0000-0000-0000-000000000003'; // Hộp hoa
    const catBasket    = 'b0000000-0000-0000-0000-000000000004'; // Giỏ hoa

    await queryInterface.bulkInsert('categories', [
      { id: catBouquet, parent_id: null, slug: 'bo-hoa',        is_active: true, display_order: 1, created_at: new Date() },
      { id: catStand,   parent_id: null, slug: 'ke-hoa',        is_active: true, display_order: 2, created_at: new Date() },
      { id: catBox,     parent_id: null, slug: 'hop-hoa',       is_active: true, display_order: 3, created_at: new Date() },
      { id: catBasket,  parent_id: null, slug: 'gio-hoa',       is_active: true, display_order: 4, created_at: new Date() },
    ], { ignoreDuplicates: true });

    await queryInterface.bulkInsert('category_translations', [
      // Bó hoa (Bouquet)
      { category_id: catBouquet, language_code: 'vi', name: 'Bó Hoa',     description: 'Các loại bó hoa tươi thắm: hồng, ly, tulip, lavender…' },
      { category_id: catBouquet, language_code: 'en', name: 'Bouquets',   description: 'Fresh flower bouquets: roses, lilies, tulips, lavender…' },
      { category_id: catBouquet, language_code: 'ko', name: '꽃다발',      description: '장미, 백합, 튤립, 라벤더 등 신선한 꽃다발' },
      // Kệ hoa (Stand / Potted)
      { category_id: catStand, language_code: 'vi', name: 'Kệ Hoa & Chậu Lan', description: 'Kệ khai trương, chậu lan hồ điệp, kệ sinh nhật' },
      { category_id: catStand, language_code: 'en', name: 'Flower Stands & Orchids', description: 'Grand opening stands, orchid pots, birthday stands' },
      { category_id: catStand, language_code: 'ko', name: '화환 & 난 화분',  description: '개업 화환, 호접란 화분, 생일 화환' },
      // Hộp hoa (Box)
      { category_id: catBox, language_code: 'vi', name: 'Hộp Hoa',      description: 'Hộp hoa sang trọng, quà tặng doanh nghiệp' },
      { category_id: catBox, language_code: 'en', name: 'Flower Boxes', description: 'Premium flower boxes and corporate gifts' },
      { category_id: catBox, language_code: 'ko', name: '꽃 박스',        description: '프리미엄 꽃 박스 및 기업 선물 세트' },
      // Giỏ hoa (Basket)
      { category_id: catBasket, language_code: 'vi', name: 'Giỏ Hoa',      description: 'Giỏ hoa cúc, cẩm tú cầu, truyền thống Chuseok' },
      { category_id: catBasket, language_code: 'en', name: 'Flower Baskets', description: 'Chrysanthemum, hydrangea, and traditional Chuseok baskets' },
      { category_id: catBasket, language_code: 'ko', name: '꽃 바구니',      description: '국화, 수국, 전통 추석 꽃바구니' },
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('category_translations', null, {});
    await queryInterface.bulkDelete('categories', null, {});
  },
};
