'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const p1 = 'p0000000-0000-0000-0000-000000000001';
    const p2 = 'p0000000-0000-0000-0000-000000000002';
    const p3 = 'p0000000-0000-0000-0000-000000000003';
    const p4 = 'p0000000-0000-0000-0000-000000000004';

    const catSinhNhat = 'b0000000-0000-0000-0000-000000000001';
    const catKhaiTruong = 'b0000000-0000-0000-0000-000000000002';

    const occValentine = 'c0000000-0000-0000-0000-000000000001';
    const occSinhNhat = 'c0000000-0000-0000-0000-000000000005';

    await queryInterface.bulkInsert('products', [
      {
        id: p1,
        sku: 'ROSE-RED-001',
        category_id: catSinhNhat,
        base_price: 550000.00,
        currency: 'VND',
        stock_quantity: 50,
        is_preorder: false,
        is_active: true,
        avg_rating: 4.90,
        review_count: 12,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: p2,
        sku: 'SUNFLOWER-001',
        category_id: catSinhNhat,
        base_price: 680000.00,
        currency: 'VND',
        stock_quantity: 35,
        is_preorder: false,
        is_active: true,
        avg_rating: 4.80,
        review_count: 8,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: p3,
        sku: 'OPENING-STAND-001',
        category_id: catKhaiTruong,
        base_price: 1500000.00,
        currency: 'VND',
        stock_quantity: 20,
        is_preorder: false,
        is_active: true,
        avg_rating: 5.00,
        review_count: 5,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: p4,
        sku: 'LILY-WHITE-001',
        category_id: catSinhNhat,
        base_price: 750000.00,
        currency: 'VND',
        stock_quantity: 40,
        is_preorder: false,
        is_active: true,
        avg_rating: 4.70,
        review_count: 6,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], { ignoreDuplicates: true });

    // Product Translations
    await queryInterface.bulkInsert('product_translations', [
      // Product 1
      { product_id: p1, language_code: 'vi', name: 'Bó Hoa Hồng Đỏ Lãng Mạn', description: '99 bông hoa hồng đỏ Đà Lạt tươi thắm tượng trưng cho tình yêu vĩnh cửu.', care_instructions: 'Thay nước bình mỗi ngày, cắt gốc hoa 45 độ.' },
      { product_id: p1, language_code: 'en', name: 'Romantic Red Roses Bouquet', description: '99 fresh Da Lat red roses symbolizing eternal love.', care_instructions: 'Change water daily, trim stems at 45 degrees.' },
      { product_id: p1, language_code: 'ko', name: '로맨틱 레드 장미 꽃다발', description: '영원한 사랑을 의미하는 99송이 생화 레드 장미 꽃다발.', care_instructions: '매일 물을 갈아주고 줄기를 45도 각도로 자르세요.' },

      // Product 2
      { product_id: p2, language_code: 'vi', name: 'Giỏ Hoa Hướng Dương Nắng Mới', description: 'Giỏ hoa hướng dương kết hợp hoa baby trắng rực rỡ và ấm áp.', care_instructions: 'Châm nước vào xốp cắm hoa mỗi sáng.' },
      { product_id: p2, language_code: 'en', name: 'Sunny Sunflower Basket', description: 'Vibrant sunflower basket paired with white baby\'s breath.', care_instructions: 'Add water to floral foam every morning.' },
      { product_id: p2, language_code: 'ko', name: '햇살 해바라기 꽃바구니', description: '밝고 따뜻한 해바라기와 안개꽃으로 구성된 꽃바구니.', care_instructions: '매일 아침 오아시스 폼에 물을 주세요.' },

      // Product 3
      { product_id: p3, language_code: 'vi', name: 'Kệ Hoa Khai Trương Phát Tài', description: 'Kệ hoa 2 tầng sang trọng với hoa hồng, đồng tiền và lan hồ điệp.', care_instructions: 'Phun sương nhẹ lên cánh hoa để giữ hoa tươi lâu.' },
      { product_id: p3, language_code: 'en', name: 'Prosperity Grand Opening Stand', description: 'Luxurious 2-tier flower stand featuring roses, gerberas, and orchids.', care_instructions: 'Lightly mist petals to keep flowers fresh.' },
      { product_id: p3, language_code: 'ko', name: '대박 기원 2단 축하 화환', description: '장미, 거베라, 서양란으로 구성된 화려한 2단 화환.', care_instructions: '꽃잎에 가볍게 분무해 주세요.' },

      // Product 4
      { product_id: p4, language_code: 'vi', name: 'Bó Hoa Ly Trắng Thanh Khiết', description: 'Bó hoa ly trắng thơm ngát mang lại cảm giác bình yên và thanh lịch.', care_instructions: 'Ngắt bỏ nhụy hoa vàng để tránh dính màu vào cánh hoa.' },
      { product_id: p4, language_code: 'en', name: 'Pure White Lily Bouquet', description: 'Fragrant white lilies bringing peace and elegance.', care_instructions: 'Remove yellow pollen to prevent staining petals.' },
      { product_id: p4, language_code: 'ko', name: '순백 백합 꽃다발', description: '은은한 향기와 우아함을 자랑하는 하얀 백합 꽃다발.', care_instructions: '꽃가루가 묻지 않도록 수술을 제거해 주세요.' },
    ], { ignoreDuplicates: true });

    // Product Images
    await queryInterface.bulkInsert('product_images', [
      { id: 'img00000-0000-0000-0000-000000000001', product_id: p1, url: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364', is_primary: true, display_order: 1 },
      { id: 'img00000-0000-0000-0000-000000000002', product_id: p2, url: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651', is_primary: true, display_order: 1 },
      { id: 'img00000-0000-0000-0000-000000000003', product_id: p3, url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9', is_primary: true, display_order: 1 },
      { id: 'img00000-0000-0000-0000-000000000004', product_id: p4, url: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11', is_primary: true, display_order: 1 },
    ], { ignoreDuplicates: true });

    // Product Variants
    await queryInterface.bulkInsert('product_variants', [
      { id: 'v0000000-0000-0000-0000-000000000001', product_id: p1, sku: 'ROSE-RED-001-S', variant_name: 'Size Tiêu Chuẩn (24 bông)', price_modifier: 0.00, stock_quantity: 30, is_active: true },
      { id: 'v0000000-0000-0000-0000-000000000002', product_id: p1, sku: 'ROSE-RED-001-L', variant_name: 'Size Cao Cấp (99 bông)', price_modifier: 400000.00, stock_quantity: 20, is_active: true },
      { id: 'v0000000-0000-0000-0000-000000000003', product_id: p2, sku: 'SUNFLOWER-001-S', variant_name: 'Size Vừa', price_modifier: 0.00, stock_quantity: 20, is_active: true },
      { id: 'v0000000-0000-0000-0000-000000000004', product_id: p2, sku: 'SUNFLOWER-001-L', variant_name: 'Size Lớn + Gấu Bông', price_modifier: 200000.00, stock_quantity: 15, is_active: true },
    ], { ignoreDuplicates: true });

    // Product Occasions
    await queryInterface.bulkInsert('product_occasions', [
      { product_id: p1, occasion_id: occValentine },
      { product_id: p1, occasion_id: occSinhNhat },
      { product_id: p2, occasion_id: occSinhNhat },
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('product_occasions', null, {});
    await queryInterface.bulkDelete('product_variants', null, {});
    await queryInterface.bulkDelete('product_images', null, {});
    await queryInterface.bulkDelete('product_translations', null, {});
    await queryInterface.bulkDelete('products', null, {});
  },
};
