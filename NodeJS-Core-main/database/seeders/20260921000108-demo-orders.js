'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const userId1 = 'a0000000-0000-0000-0000-000000000003'; // customer
    const userId2 = 'a0000000-0000-0000-0000-000000000004'; // Kim Min-Jun

    const productId1 = 'p0000000-0000-0000-0000-000000000001'; // Bó Hồng Phấn Premium 24 Bông (850,000)
    const productId2 = 'p0000000-0000-0000-0000-000000000008'; // Bó 99 Hoa Hồng Đỏ (2,900,000)
    const productId3 = 'p0000000-0000-0000-0000-000000000010'; // Hộp Quà Doanh Nghiệp Premium (1,200,000)

    const orderId1 = 'o0000000-0000-0000-0000-000000000001';
    const orderId2 = 'o0000000-0000-0000-0000-000000000002';
    const orderId3 = 'o0000000-0000-0000-0000-000000000003';
    const orderId4 = 'o0000000-0000-0000-0000-000000000004';
    const orderId5 = 'o0000000-0000-0000-0000-000000000005';

    await queryInterface.bulkInsert('orders', [
      {
        id: orderId1,
        order_number: 'ORD-20261008-001',
        user_id: userId1,
        coupon_id: null,
        status: 'pending',
        payment_status: 'unpaid',
        payment_method: 'cod',
        subtotal: 850000.00,
        discount_amount: 0.00,
        shipping_fee: 30000.00,
        total_amount: 880000.00,
        currency: 'VND',
        delivery_type: 'standard',
        recipient_name: 'Nguyễn Văn Khách',
        recipient_phone: '0903333333',
        delivery_address: '123 Đường Lê Lợi, Quận 1, TP. HCM',
        card_message: 'Chúc mừng sinh nhật!',
        notes: 'Giao trong giờ hành chính',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: orderId2,
        order_number: 'ORD-20261008-002',
        user_id: userId2,
        coupon_id: null,
        status: 'confirmed',
        payment_status: 'paid',
        payment_method: 'bank_transfer',
        subtotal: 2900000.00,
        discount_amount: 0.00,
        shipping_fee: 50000.00,
        total_amount: 2950000.00,
        currency: 'VND',
        delivery_type: 'scheduled',
        scheduled_delivery_at: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // tomorrow
        recipient_name: 'Kim Min-Jun',
        recipient_phone: '0904444444',
        delivery_address: 'Landmark 81, Quận Bình Thạnh, TP. HCM',
        card_message: 'Happy Anniversary!',
        notes: 'Gọi trước khi giao 30 phút',
        paid_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: orderId3,
        order_number: 'ORD-20261008-003',
        user_id: userId1,
        coupon_id: null,
        status: 'delivered',
        payment_status: 'paid',
        payment_method: 'momo',
        subtotal: 1200000.00,
        discount_amount: 100000.00,
        shipping_fee: 0.00, // Freeship
        total_amount: 1100000.00,
        currency: 'VND',
        delivery_type: 'standard',
        recipient_name: 'Công ty TNHH Hoa Hồng',
        recipient_phone: '0905555555',
        delivery_address: 'Tòa nhà Bitexco, Quận 1, TP. HCM',
        card_message: 'Kính chúc Quý công ty ngày càng phát triển.',
        notes: 'Giao đến quầy lễ tân',
        paid_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // delivered
      },
      {
        id: orderId4,
        order_number: 'ORD-20261008-004',
        user_id: userId2,
        coupon_id: null,
        status: 'processing',
        payment_status: 'paid',
        payment_method: 'vnpay',
        subtotal: 1700000.00,
        discount_amount: 0.00,
        shipping_fee: 40000.00,
        total_amount: 1740000.00,
        currency: 'VND',
        delivery_type: 'standard',
        recipient_name: 'Lee Yeon Hee',
        recipient_phone: '0906666666',
        delivery_address: 'Khu dân cư Phú Mỹ Hưng, Quận 7, TP. HCM',
        card_message: 'Chúc em ngày mới tốt lành!',
        notes: '',
        paid_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: orderId5,
        order_number: 'ORD-20261008-005',
        user_id: userId1,
        coupon_id: null,
        status: 'cancelled',
        payment_status: 'unpaid',
        payment_method: 'cod',
        subtotal: 850000.00,
        discount_amount: 0.00,
        shipping_fee: 30000.00,
        total_amount: 880000.00,
        currency: 'VND',
        delivery_type: 'standard',
        recipient_name: 'Nguyễn Văn Khách',
        recipient_phone: '0903333333',
        delivery_address: '123 Đường Lê Lợi, Quận 1, TP. HCM',
        card_message: '',
        notes: 'Khách đổi ý',
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      },
    ], { ignoreDuplicates: true });

    await queryInterface.bulkInsert('order_items', [
      {
        id: 'oi00000-0000-0000-0000-000000000001',
        order_id: orderId1,
        product_id: productId1,
        variant_id: null,
        product_name_snapshot: 'Bó Hồng Phấn Premium 24 Bông',
        quantity: 1,
        unit_price: 850000.00,
        subtotal: 850000.00,
      },
      {
        id: 'oi00000-0000-0000-0000-000000000002',
        order_id: orderId2,
        product_id: productId2,
        variant_id: null,
        product_name_snapshot: 'Bó 99 Hoa Hồng Đỏ',
        quantity: 1,
        unit_price: 2900000.00,
        subtotal: 2900000.00,
      },
      {
        id: 'oi00000-0000-0000-0000-000000000003',
        order_id: orderId3,
        product_id: productId3,
        variant_id: null,
        product_name_snapshot: 'Hộp Quà Doanh Nghiệp Premium',
        quantity: 1,
        unit_price: 1200000.00,
        subtotal: 1200000.00,
      },
      {
        id: 'oi00000-0000-0000-0000-000000000004',
        order_id: orderId4,
        product_id: productId1,
        variant_id: null,
        product_name_snapshot: 'Bó Hồng Phấn Premium 24 Bông',
        quantity: 2,
        unit_price: 850000.00,
        subtotal: 1700000.00,
      },
      {
        id: 'oi00000-0000-0000-0000-000000000005',
        order_id: orderId5,
        product_id: productId1,
        variant_id: null,
        product_name_snapshot: 'Bó Hồng Phấn Premium 24 Bông',
        quantity: 1,
        unit_price: 850000.00,
        subtotal: 850000.00,
      },
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('order_items', null, {});
    await queryInterface.bulkDelete('orders', null, {});
  },
};
