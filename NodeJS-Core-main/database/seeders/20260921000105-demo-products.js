'use strict';

/**
 * Seed 24 sản phẩm hoa thực tế (khớp 1:1 với frontend PRODUCTS[])
 * Bao gồm: products, product_translations (vi + ko), product_images,
 *           product_variants, product_occasions
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    // ── Category IDs (must match demo-categories seeder) ──
    const catBouquet = 'b0000000-0000-0000-0000-000000000001';
    const catStand   = 'b0000000-0000-0000-0000-000000000002';
    const catBox     = 'b0000000-0000-0000-0000-000000000003';
    const catBasket  = 'b0000000-0000-0000-0000-000000000004';

    // ── Occasion IDs (must match demo-occasions seeder) ──
    const occValentine  = 'c0000000-0000-0000-0000-000000000001';
    const occChuseok    = 'c0000000-0000-0000-0000-000000000004';
    const occSinhNhat   = 'c0000000-0000-0000-0000-000000000005';
    const occKhaiTruong = 'c0000000-0000-0000-0000-000000000006';
    const occWedding    = 'c0000000-0000-0000-0000-000000000007';
    const occCorporate  = 'c0000000-0000-0000-0000-000000000008';

    // Mapping frontend category → DB category UUID
    const CAT = {
      bouquet: catBouquet,
      box:     catBox,
      basket:  catBasket,
      stand:   catStand,
    };

    // Mapping frontend occasion key → DB occasion UUID
    const OCC = {
      birthday:  occSinhNhat,
      opening:   occKhaiTruong,
      wedding:   occWedding,
      corporate: occCorporate,
      chuseok:   occChuseok,
      valentine: occValentine,
    };

    // ── Product ID generator ──
    const pid = (n) => `p0000000-0000-0000-0000-${String(n).padStart(12, '0')}`;
    const imgId = (n) => `img00000-0000-0000-0000-${String(n).padStart(12, '0')}`;
    const varId = (n) => `v0000000-0000-0000-0000-${String(n).padStart(12, '0')}`;

    // ══════════════════════════════════════════════════════════════════
    // DATA: 24 sản phẩm hoa thực tế (khớp với PRODUCTS[] ở frontend)
    // ══════════════════════════════════════════════════════════════════
    const items = [
      {
        id: 1, sku: 'BQ-ROSE-PINK-24',
        category: 'bouquet', basePrice: 850000,
        stock: 12, rating: 4.85, reviews: 24,
        nameVi: 'Bó Hồng Phấn Premium 24 Bông',
        nameKo: '프리미엄 핑크 장미 24송이',
        descVi: '24 bông hồng phấn Đà Lạt kết hợp baby\'s breath tinh tế, gói giấy kraft sang trọng.',
        descKo: '달랏산 핑크 장미 24송이, 안개꽃 조합. 크래프트지 고급 포장.',
        careVi: 'Thay nước mỗi ngày. Cắt gốc 2cm nghiêng 45°. Tránh ánh nắng trực tiếp.',
        careKo: '매일 물을 갈아주세요. 줄기를 45도 각도로 2cm 잘라주세요.',
        img: 'https://images.unsplash.com/photo-1680563094046-5d846e2c59d1?w=500&h=620&fit=crop&auto=format',
        occasions: ['birthday', 'valentine'],
        variants: [
          { name: 'Size Tiêu Chuẩn (24 bông)', modifier: 0, stock: 8 },
          { name: 'Size Đại (36 bông)', modifier: 200000, stock: 4 },
        ],
      },
      {
        id: 2, sku: 'BQ-TULIP-PINK-20',
        category: 'bouquet', basePrice: 580000,
        stock: 10, rating: 4.70, reviews: 15,
        nameVi: 'Bó Tulip Hồng Đà Lạt',
        nameKo: '달랏 핑크 튤립 꽃다발',
        descVi: 'Tulip hồng tươi Đà Lạt, 20 bông, gói giấy trắng tinh.',
        descKo: '달랏 핑크 튤립 20송이. 화이트 래핑.',
        careVi: 'Giữ nơi mát mẻ. Thay nước 2 ngày/lần. Hoa bền 5-7 ngày.',
        careKo: '서늘한 곳에 보관하세요. 2일마다 물을 교체하세요.',
        img: 'https://images.unsplash.com/photo-1490750967868-88df5691cc02?w=500&h=620&fit=crop&auto=format',
        occasions: ['birthday', 'valentine'],
        variants: [
          { name: 'Bó 20 bông', modifier: 0, stock: 7 },
          { name: 'Bó 30 bông', modifier: 150000, stock: 3 },
        ],
      },
      {
        id: 3, sku: 'BQ-SUNFLOWER-MIX',
        category: 'bouquet', basePrice: 450000,
        stock: 20, rating: 4.60, reviews: 18,
        nameVi: 'Bó Hướng Dương Tươi Sáng',
        nameKo: '밝은 해바라기 꽃다발',
        descVi: 'Hoa hướng dương tươi, gói giấy lụa vàng. Năng lượng hạnh phúc.',
        descKo: '해바라기 꽃다발, 노란 실크 포장.',
        careVi: 'Thay nước mỗi ngày. Để nơi có ánh sáng nhẹ.',
        careKo: '매일 물을 교체하세요. 밝은 곳에 두세요.',
        img: 'https://images.unsplash.com/photo-1644248422980-8e0eb75a1557?w=500&h=620&fit=crop&auto=format',
        occasions: ['birthday', 'chuseok'],
        variants: [
          { name: 'Bó vừa (5 bông)', modifier: 0, stock: 12 },
          { name: 'Bó lớn (10 bông)', modifier: 180000, stock: 8 },
        ],
      },
      {
        id: 4, sku: 'BQ-LILY-WHITE-12',
        category: 'bouquet', basePrice: 680000,
        stock: 6, rating: 4.90, reviews: 10,
        nameVi: 'Bó Hoa Ly Trắng Tinh',
        nameKo: '순백 백합 꽃다발',
        descVi: 'Hoa ly trắng thuần khiết, 12 bông. Trang nhã và sang trọng.',
        descKo: '흰 백합 12송이. 우아하고 고급스러운.',
        careVi: 'Ngắt nhụy vàng tránh dính cánh. Thay nước hàng ngày.',
        careKo: '꽃가루가 묻지 않도록 수술을 제거하세요.',
        img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&h=620&fit=crop&auto=format',
        occasions: ['birthday', 'wedding'],
        variants: [
          { name: 'Bó 12 bông', modifier: 0, stock: 4 },
          { name: 'Bó 20 bông', modifier: 250000, stock: 2 },
        ],
      },
      {
        id: 5, sku: 'BQ-LAVENDER-MIX',
        category: 'bouquet', basePrice: 490000,
        stock: 14, rating: 4.75, reviews: 12,
        nameVi: 'Bó Lavender Mix Mộng Mơ',
        nameKo: '라벤더 믹스 꽃다발',
        descVi: 'Hoa lavender mix, gói giấy xám bạc tinh tế.',
        descKo: '라벤더 믹스, 실버 그레이 래핑.',
        careVi: 'Để nơi thoáng mát, phun sương nhẹ mỗi sáng.',
        careKo: '통풍이 잘 되는 곳에 두고 매일 가볍게 분무해주세요.',
        img: 'https://images.unsplash.com/photo-1521334726092-b509a19597c6?w=500&h=620&fit=crop&auto=format',
        occasions: ['birthday', 'valentine'],
        variants: [
          { name: 'Size Tiêu Chuẩn', modifier: 0, stock: 10 },
          { name: 'Size Lớn + Gấu Bông', modifier: 200000, stock: 4 },
        ],
      },
      {
        id: 6, sku: 'BQ-SPRING-MIX',
        category: 'bouquet', basePrice: 480000,
        stock: 15, rating: 4.50, reviews: 8,
        nameVi: 'Bó Hoa Mùa Xuân Đa Sắc',
        nameKo: '봄 믹스 꽃다발',
        descVi: 'Hoa mùa xuân đa sắc: hồng, vàng, trắng. Tươi và vui tươi.',
        descKo: '봄 믹스 꽃다발: 핑크, 노랑, 화이트.',
        careVi: 'Thay nước 2 ngày/lần. Cắt gốc mỗi lần thay nước.',
        careKo: '2일마다 물을 갈아주세요. 물을 갈 때마다 줄기를 잘라주세요.',
        img: 'https://images.unsplash.com/photo-1589131854040-89f700aeafcd?w=500&h=620&fit=crop&auto=format',
        occasions: ['birthday'],
        variants: [
          { name: 'Bó vừa', modifier: 0, stock: 10 },
          { name: 'Bó đại', modifier: 220000, stock: 5 },
        ],
      },
      {
        id: 7, sku: 'BQ-CARNATION-MIX',
        category: 'bouquet', basePrice: 380000,
        stock: 18, rating: 4.65, reviews: 20,
        nameVi: 'Bó Cẩm Chướng Tình Mẫu Tử',
        nameKo: '카네이션 꽃다발',
        descVi: 'Cẩm chướng nhiều màu, gói giấy kraft. Ý nghĩa tình mẫu tử.',
        descKo: '다양한 색의 카네이션. 크래프트지 포장.',
        careVi: 'Hoa bền 7-10 ngày. Thay nước hàng ngày, cắt gốc 1cm.',
        careKo: '7-10일 유지됩니다. 매일 물을 교체하고 줄기를 1cm 잘라주세요.',
        img: 'https://images.unsplash.com/photo-1562519422-ced6a0e2f5b4?w=500&h=620&fit=crop&auto=format',
        occasions: ['birthday', 'chuseok'],
        variants: [
          { name: 'Bó 20 bông', modifier: 0, stock: 12 },
          { name: 'Bó 40 bông', modifier: 150000, stock: 6 },
        ],
      },
      {
        id: 8, sku: 'BQ-ROSE-RED-99',
        category: 'bouquet', basePrice: 2900000,
        stock: 8, rating: 4.95, reviews: 32,
        nameVi: 'Bó 99 Hoa Hồng Đỏ',
        nameKo: '빨간 장미 99송이',
        descVi: '99 bông hồng đỏ — biểu tượng tình yêu vĩnh cửu. Gói hộp trái tim.',
        descKo: '빨간 장미 99송이 — 영원한 사랑의 상징. 하트 박스 포장.',
        careVi: 'Phun sương 2 lần/ngày. Thay nước hàng ngày. Bảo quản mát.',
        careKo: '하루에 2번 분무해주세요. 매일 물을 교체하세요.',
        img: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=500&h=620&fit=crop&auto=format',
        occasions: ['valentine', 'birthday'],
        variants: [
          { name: '99 bông hồng đỏ', modifier: 0, stock: 5 },
          { name: '108 bông hồng đỏ VIP', modifier: 500000, stock: 3 },
        ],
      },
      {
        id: 9, sku: 'BOX-PASTEL-MIX',
        category: 'box', basePrice: 650000,
        stock: 8, rating: 4.80, reviews: 14,
        nameVi: 'Hộp Hoa Mix Pastel',
        nameKo: '파스텔 믹스 꽃 박스',
        descVi: 'Hộp hoa tông pastel: hồng nhạt, lavender, trắng kem. Kèm thiệp viết tay.',
        descKo: '파스텔 톤 꽃 박스. 손편지 카드 포함.',
        careVi: 'Phun sương 1-2 lần/ngày. Bảo quản nơi mát, tránh nắng.',
        careKo: '하루 1-2회 분무. 서늘한 곳에 보관하세요.',
        img: 'https://images.unsplash.com/photo-1644248423441-bc7c5dcebeb6?w=500&h=620&fit=crop&auto=format',
        occasions: ['birthday', 'corporate'],
        variants: [
          { name: 'Hộp vừa', modifier: 0, stock: 5 },
          { name: 'Hộp lớn + Thiệp', modifier: 250000, stock: 3 },
        ],
      },
      {
        id: 10, sku: 'BOX-CORPORATE-PREM',
        category: 'box', basePrice: 1200000,
        stock: 10, rating: 4.90, reviews: 22,
        nameVi: 'Hộp Quà Doanh Nghiệp Premium',
        nameKo: '프리미엄 기업용 꽃 선물 세트',
        descVi: 'Hộp hoa kèm chocolat & thiệp in logo doanh nghiệp. Giao tận văn phòng.',
        descKo: '꽃 박스 + 초콜릿 + 로고 카드. 사무실 배달.',
        careVi: 'Bảo quản mát (18-22°C). Hoa bền 5-7 ngày.',
        careKo: '시원한 곳(18-22°C)에 보관하세요. 5-7일 유지됩니다.',
        img: 'https://images.unsplash.com/photo-1667010723263-8ad9a8f5f6c6?w=500&h=620&fit=crop&auto=format',
        occasions: ['corporate', 'opening'],
        variants: [
          { name: 'Hộp Standard', modifier: 0, stock: 6 },
          { name: 'Hộp VIP + Socola Bỉ', modifier: 350000, stock: 4 },
        ],
      },
      {
        id: 11, sku: 'BOX-VIP-NUDE',
        category: 'box', basePrice: 1500000,
        stock: 6, rating: 4.95, reviews: 9,
        nameVi: 'Hộp Hoa Cao Cấp VIP',
        nameKo: 'VIP 고급 꽃 박스',
        descVi: 'Hộp hoa sang trọng tông nude & trắng. Dành cho đối tác VIP.',
        descKo: '누드 & 화이트 톤 고급 꽃 박스. VIP 파트너용.',
        careVi: 'Phun sương nhẹ 2 lần/ngày. Bảo quản 18-20°C.',
        careKo: '하루 2번 가볍게 분무. 18-20°C 보관.',
        img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=500&h=620&fit=crop&auto=format',
        occasions: ['corporate', 'wedding'],
        variants: [
          { name: 'Hộp sang trọng', modifier: 0, stock: 4 },
          { name: 'Hộp siêu VIP + Rượu vang', modifier: 500000, stock: 2 },
        ],
      },
      {
        id: 12, sku: 'BOX-DRIED-ROMANTIC',
        category: 'box', basePrice: 390000,
        stock: 20, rating: 4.55, reviews: 16,
        nameVi: 'Hộp Hoa Khô Lãng Mạn',
        nameKo: '로맨틱 드라이 플라워 박스',
        descVi: 'Hộp hoa khô: hồng khô, lavender, rơm vàng. Lưu giữ mãi mãi.',
        descKo: '드라이 플라워 박스: 말린 장미, 라벤더, 밀짚.',
        careVi: 'Tránh ẩm ướt. Không cần tưới nước. Bền 6-12 tháng.',
        careKo: '습기를 피하세요. 물을 줄 필요 없습니다. 6-12개월 유지.',
        img: 'https://images.unsplash.com/photo-1644248423441-bc7c5dcebeb6?w=500&h=620&fit=crop&auto=format&crop=right',
        occasions: ['valentine', 'birthday'],
        variants: [
          { name: 'Hộp nhỏ', modifier: 0, stock: 14 },
          { name: 'Hộp lớn', modifier: 180000, stock: 6 },
        ],
      },
      {
        id: 13, sku: 'BSK-CHRYSAN-YELLOW',
        category: 'basket', basePrice: 520000,
        stock: 15, rating: 4.70, reviews: 11,
        nameVi: 'Giỏ Hoa Cúc Vàng Chuseok',
        nameKo: '추석 노란 국화 꽃 바구니',
        descVi: 'Giỏ cúc vàng rực rỡ, biểu tượng may mắn trong văn hoá Hàn Quốc.',
        descKo: '추석 노란 국화 바구니, 행운의 상징.',
        careVi: 'Châm nước vào xốp mỗi sáng. Hoa bền 7-10 ngày.',
        careKo: '매일 아침 오아시스 폼에 물을 보충하세요.',
        img: 'https://images.unsplash.com/photo-1689061732262-2f8a68fa99cb?w=500&h=620&fit=crop&auto=format',
        occasions: ['chuseok', 'corporate'],
        variants: [
          { name: 'Giỏ vừa', modifier: 0, stock: 10 },
          { name: 'Giỏ lớn + Trái cây', modifier: 300000, stock: 5 },
        ],
      },
      {
        id: 14, sku: 'BSK-CHUSEOK-TRAD',
        category: 'basket', basePrice: 620000,
        stock: 11, rating: 4.80, reviews: 7,
        nameVi: 'Giỏ Truyền Thống Chuseok',
        nameKo: '전통 추석 꽃 바구니',
        descVi: 'Giỏ hoa truyền thống Chuseok: cúc vàng, cúc trắng. Tặng gia đình.',
        descKo: '전통 추석 꽃 바구니: 노란 국화, 흰 국화. 가족 선물.',
        careVi: 'Thay nước trong giỏ mỗi 2 ngày. Để nơi mát mẻ.',
        careKo: '2일마다 물을 교체하세요. 서늘한 곳에 두세요.',
        img: 'https://images.unsplash.com/photo-1689061732262-2f8a68fa99cb?w=500&h=620&fit=crop&auto=format&crop=right',
        occasions: ['chuseok'],
        variants: [
          { name: 'Giỏ truyền thống', modifier: 0, stock: 7 },
          { name: 'Giỏ cao cấp + Bánh Songpyeon', modifier: 280000, stock: 4 },
        ],
      },
      {
        id: 15, sku: 'BSK-HYDRANGEA-BLUE',
        category: 'basket', basePrice: 750000,
        stock: 9, rating: 4.85, reviews: 13,
        nameVi: 'Giỏ Hortensia Xanh Nhẹ',
        nameKo: '연청 수국 꽃 바구니',
        descVi: 'Giỏ hoa cẩm tú cầu xanh nhạt thanh lịch. Phù hợp văn phòng.',
        descKo: '연청 수국 꽃 바구니. 사무실에 적합.',
        careVi: 'Phun sương lên cánh hoa 2 lần/ngày. Thay nước hàng ngày.',
        careKo: '하루 2번 꽃잎에 분무. 매일 물을 교체하세요.',
        img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&h=620&fit=crop&auto=format&crop=right',
        occasions: ['corporate', 'birthday'],
        variants: [
          { name: 'Giỏ vừa', modifier: 0, stock: 6 },
          { name: 'Giỏ đại + Thiệp', modifier: 250000, stock: 3 },
        ],
      },
      {
        id: 16, sku: 'STD-OPENING-2TIER',
        category: 'stand', basePrice: 1800000,
        stock: 5, rating: 4.90, reviews: 18,
        nameVi: 'Kệ Khai Trương 2 Tầng Premium',
        nameKo: '2단 프리미엄 개업 화환',
        descVi: 'Kệ 2 tầng sang trọng, chữ vàng theo yêu cầu. Khai trương văn phòng, nhà hàng.',
        descKo: '2단 고급 화환, 맞춤 금박 문구. 사무실, 레스토랑 개업.',
        careVi: 'Phun sương nhẹ lên cánh hoa để giữ hoa tươi 3-5 ngày.',
        careKo: '꽃잎에 가볍게 분무하면 3-5일 유지됩니다.',
        img: 'https://images.unsplash.com/photo-1760618511409-9d80f26e36f4?w=500&h=620&fit=crop&auto=format',
        occasions: ['opening'],
        variants: [
          { name: 'Kệ 2 tầng Standard', modifier: 0, stock: 3 },
          { name: 'Kệ 2 tầng VIP + Chữ vàng', modifier: 400000, stock: 2 },
        ],
      },
      {
        id: 17, sku: 'STD-OPENING-3TIER',
        category: 'stand', basePrice: 2800000,
        stock: 3, rating: 5.00, reviews: 6,
        nameVi: 'Kệ Khai Trương 3 Tầng Vàng',
        nameKo: '3단 골드 개업 화환',
        descVi: 'Kệ 3 tầng đại sang, hoa cúc vàng tươi. Dành cho khai trương lớn.',
        descKo: '3단 대형 화환, 노란 국화. 대규모 개업에 적합.',
        careVi: 'Phun nước giữ ẩm, tránh đặt gần máy lạnh.',
        careKo: '습기 유지를 위해 분무. 에어컨 근처에 두지 마세요.',
        img: 'https://images.unsplash.com/photo-1760618511409-9d80f26e36f4?w=500&h=620&fit=crop&auto=format&crop=entropy',
        occasions: ['opening'],
        variants: [
          { name: 'Kệ 3 tầng Premium', modifier: 0, stock: 2 },
          { name: 'Kệ 3 tầng Đại + Lan', modifier: 700000, stock: 1 },
        ],
      },
      {
        id: 18, sku: 'STD-ORCHID-POT',
        category: 'stand', basePrice: 1100000,
        stock: 6, rating: 4.85, reviews: 15,
        nameVi: 'Chậu Lan Hồ Điệp Cao Cấp',
        nameKo: '고급 호접란 화분',
        descVi: 'Lan hồ điệp trắng hoặc tím theo yêu cầu. Biểu tượng may mắn, trường thọ.',
        descKo: '흰색 또는 보라색 호접란. 행운의 상징.',
        careVi: 'Tưới 1 lần/tuần. Ánh sáng gián tiếp. Bón phân lan 1 lần/tháng.',
        careKo: '주 1회 물주기. 간접광. 월 1회 란 비료 주기.',
        img: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=500&h=620&fit=crop&auto=format',
        occasions: ['opening', 'corporate'],
        variants: [
          { name: 'Chậu 1 cành (7-9 bông)', modifier: 0, stock: 4 },
          { name: 'Chậu 2 cành (15+ bông)', modifier: 450000, stock: 2 },
        ],
      },
      {
        id: 19, sku: 'STD-OPENING-CLASSIC',
        category: 'stand', basePrice: 1650000,
        stock: 7, rating: 4.75, reviews: 10,
        nameVi: 'Kệ Hoa Khai Trương Classic',
        nameKo: '클래식 개업 화환',
        descVi: 'Kệ hoa classic, hoa hỗn hợp tươi. Phù hợp mọi loại cơ sở kinh doanh.',
        descKo: '클래식 화환, 혼합 신선 꽃. 모든 비즈니스에 적합.',
        careVi: 'Phun nước nhẹ mỗi sáng. Tránh nắng trực tiếp.',
        careKo: '매일 아침 가볍게 분무. 직사광선 피하세요.',
        img: 'https://images.unsplash.com/photo-1760618511409-9d80f26e36f4?w=500&h=620&fit=crop&auto=format&crop=faces',
        occasions: ['opening'],
        variants: [
          { name: 'Kệ Classic', modifier: 0, stock: 5 },
          { name: 'Kệ Classic + Bánh kem', modifier: 350000, stock: 2 },
        ],
      },
      {
        id: 20, sku: 'STD-BIRTHDAY-KR',
        category: 'stand', basePrice: 950000,
        stock: 4, rating: 4.80, reviews: 8,
        nameVi: 'Kệ Hoa Sinh Nhật Hàn Quốc',
        nameKo: '한국 스타일 생일 화환',
        descVi: 'Kệ sinh nhật phong cách Hàn Quốc hiện đại. In tên và lời chúc theo yêu cầu.',
        descKo: '한국 스타일 생일 화환. 이름과 메시지 맞춤.',
        careVi: 'Phun sương giữ ẩm. Hoa tươi 3-5 ngày.',
        careKo: '습기 유지를 위해 분무. 3-5일 유지됩니다.',
        img: 'https://images.unsplash.com/photo-1652346107876-58d7354ce9b8?w=500&h=620&fit=crop&auto=format',
        occasions: ['birthday'],
        variants: [
          { name: 'Kệ sinh nhật Standard', modifier: 0, stock: 3 },
          { name: 'Kệ sinh nhật + Bánh + Nến', modifier: 300000, stock: 1 },
        ],
      },
      {
        id: 21, sku: 'BQ-BRIDAL-WHITE',
        category: 'bouquet', basePrice: 720000,
        stock: 6, rating: 4.90, reviews: 11,
        nameVi: 'Bó Cầm Tay Cô Dâu Thuần Trắng',
        nameKo: '신부 순백 부케',
        descVi: 'Bó hoa trắng: hoa ly, hồng trắng, baby breath. Cho ngày trọng đại.',
        descKo: '흰 부케: 백합, 흰 장미, 안개꽃. 특별한 날을 위한.',
        careVi: 'Giữ trong hộp lạnh đến khi sử dụng. Phun sương nhẹ.',
        careKo: '사용 전까지 시원하게 보관. 가볍게 분무.',
        img: 'https://images.unsplash.com/photo-1652346072098-cfc2e94d30e7?w=500&h=620&fit=crop&auto=format',
        occasions: ['wedding'],
        variants: [
          { name: 'Bó cầm tay Standard', modifier: 0, stock: 4 },
          { name: 'Bó cầm tay Luxury + Corsage', modifier: 300000, stock: 2 },
        ],
      },
      {
        id: 22, sku: 'BQ-WEDDING-PINK',
        category: 'bouquet', basePrice: 890000,
        stock: 5, rating: 4.85, reviews: 9,
        nameVi: 'Bó Cưới Hồng Ngọt Ngào',
        nameKo: '달콤한 핑크 웨딩 부케',
        descVi: 'Bó cầm tay cô dâu tông hồng ngọt. Hoa hồng, mẫu đơn, baby breath.',
        descKo: '달콤한 핑크 웨딩 부케. 장미, 모란, 안개꽃.',
        careVi: 'Bảo quản lạnh (4-8°C). Phun sương trước 30 phút sử dụng.',
        careKo: '냉장 보관(4-8°C). 사용 30분 전 분무.',
        img: 'https://images.unsplash.com/photo-1520763185298-128e5c58a49a?w=500&h=620&fit=crop&auto=format',
        occasions: ['wedding'],
        variants: [
          { name: 'Bó cầm tay Pink', modifier: 0, stock: 3 },
          { name: 'Bó cầm tay Pink + Cài áo chú rể', modifier: 200000, stock: 2 },
        ],
      },
      {
        id: 23, sku: 'BQ-PEONY-PREMIUM',
        category: 'bouquet', basePrice: 1200000,
        stock: 8, rating: 4.90, reviews: 19,
        nameVi: 'Bó Mẫu Đơn Hồng Cao Cấp',
        nameKo: '프리미엄 모란 꽃다발',
        descVi: 'Mẫu đơn hồng đậm, sang trọng và quyến rũ. Biểu tượng hạnh phúc.',
        descKo: '깊은 핑크 모란, 고급스럽고 매혹적인. 행복의 상징.',
        careVi: 'Thay nước hàng ngày. Để nơi mát, tránh nắng. Bền 5-7 ngày.',
        careKo: '매일 물을 교체하세요. 서늘하게 보관. 5-7일 유지.',
        img: 'https://images.unsplash.com/photo-1530092285049-1c42085fd395?w=500&h=620&fit=crop&auto=format',
        occasions: ['wedding', 'valentine'],
        variants: [
          { name: 'Bó 10 bông', modifier: 0, stock: 5 },
          { name: 'Bó 20 bông Premium', modifier: 600000, stock: 3 },
        ],
      },
      {
        id: 24, sku: 'BSK-HYDRANGEA-PURP',
        category: 'basket', basePrice: 680000,
        stock: 7, rating: 4.75, reviews: 14,
        nameVi: 'Giỏ Hortensia Tím Mộng',
        nameKo: '보라 수국 꽃 바구니',
        descVi: 'Giỏ cẩm tú cầu tím mộng mơ, dây ruy băng be. Tinh tế và lãng mạn.',
        descKo: '보라 수국 꽃 바구니, 베이지 리본. 우아하고 로맨틱.',
        careVi: 'Phun sương lên cánh hoa mỗi sáng. Thay nước 2 ngày/lần.',
        careKo: '매일 아침 꽃잎에 분무. 2일마다 물 교체.',
        img: 'https://images.unsplash.com/photo-1496661415325-ef852f9e8e7c?w=500&h=620&fit=crop&auto=format',
        occasions: ['wedding', 'birthday'],
        variants: [
          { name: 'Giỏ vừa', modifier: 0, stock: 5 },
          { name: 'Giỏ lớn + Socola', modifier: 220000, stock: 2 },
        ],
      },
    ];

    // ══════════════════════════════════════════
    // INSERT: products
    // ══════════════════════════════════════════
    const products = items.map((item) => ({
      id: pid(item.id),
      sku: item.sku,
      category_id: CAT[item.category],
      base_price: item.basePrice,
      currency: 'VND',
      stock_quantity: item.stock,
      is_preorder: false,
      is_active: true,
      avg_rating: item.rating,
      review_count: item.reviews,
      created_at: new Date(),
      updated_at: new Date(),
    }));
    await queryInterface.bulkInsert('products', products, { ignoreDuplicates: true });

    // ══════════════════════════════════════════
    // INSERT: product_translations (vi + ko)
    // ══════════════════════════════════════════
    const translations = [];
    for (const item of items) {
      translations.push(
        {
          product_id: pid(item.id),
          language_code: 'vi',
          name: item.nameVi,
          description: item.descVi,
          care_instructions: item.careVi,
        },
        {
          product_id: pid(item.id),
          language_code: 'ko',
          name: item.nameKo,
          description: item.descKo,
          care_instructions: item.careKo,
        }
      );
    }
    await queryInterface.bulkInsert('product_translations', translations, { ignoreDuplicates: true });

    // ══════════════════════════════════════════
    // INSERT: product_images (1 primary image per product)
    // ══════════════════════════════════════════
    const images = items.map((item) => ({
      id: imgId(item.id),
      product_id: pid(item.id),
      url: item.img,
      is_primary: true,
      display_order: 1,
    }));
    await queryInterface.bulkInsert('product_images', images, { ignoreDuplicates: true });

    // ══════════════════════════════════════════
    // INSERT: product_variants (2 variants per product)
    // ══════════════════════════════════════════
    const variants = [];
    let variantCounter = 1;
    for (const item of items) {
      for (let vi = 0; vi < item.variants.length; vi++) {
        const v = item.variants[vi];
        variants.push({
          id: varId(variantCounter),
          product_id: pid(item.id),
          sku: `${item.sku}-V${vi + 1}`,
          variant_name: v.name,
          price_modifier: v.modifier,
          stock_quantity: v.stock,
          is_active: true,
        });
        variantCounter++;
      }
    }
    await queryInterface.bulkInsert('product_variants', variants, { ignoreDuplicates: true });

    // ══════════════════════════════════════════
    // INSERT: product_occasions
    // ══════════════════════════════════════════
    const productOccasions = [];
    for (const item of items) {
      for (const occ of item.occasions) {
        productOccasions.push({
          product_id: pid(item.id),
          occasion_id: OCC[occ],
        });
      }
    }
    await queryInterface.bulkInsert('product_occasions', productOccasions, { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('product_occasions', null, {});
    await queryInterface.bulkDelete('product_variants', null, {});
    await queryInterface.bulkDelete('product_images', null, {});
    await queryInterface.bulkDelete('product_translations', null, {});
    await queryInterface.bulkDelete('products', null, {});
  },
};
