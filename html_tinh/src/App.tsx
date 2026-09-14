import { useState, useEffect, useRef } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
type Lang = 'vi' | 'ko'
type Page = 'home' | 'shop' | 'cart' | 'checkout' | 'product'
type OccasionKey = 'birthday' | 'opening' | 'wedding' | 'corporate' | 'chuseok' | 'valentine'

interface Product {
  id: number
  nameVi: string; nameKo: string
  price: number; originalPrice?: number
  occasions: OccasionKey[]
  category: 'bouquet' | 'box' | 'basket' | 'stand'
  img: string
  descVi: string; descKo: string
  meaningVi?: string; meaningKo?: string
  isNew?: boolean; isPopular?: boolean
  stock: number
}

interface CartItem { product: Product; qty: number; note: string }

// ─── Occasion meta ────────────────────────────────────────────────────────────
const OCC: Record<OccasionKey, { vi: string; ko: string }> = {
  birthday:  { vi: 'Hoa Sinh Nhật',         ko: '생일 꽃' },
  opening:   { vi: 'Hoa Khai Trương',        ko: '개업 꽃' },
  wedding:   { vi: 'Hoa Cưới Hỏi',           ko: '결혼 꽃' },
  corporate: { vi: 'Quà Doanh Nghiệp',       ko: '기업 선물' },
  chuseok:   { vi: 'Chuseok 추석',            ko: '추석 꽃' },
  valentine: { vi: 'Valentine · 화이트데이',  ko: '화이트데이' },
}

const OCCASION_KEYS: OccasionKey[] = ['birthday', 'opening', 'wedding', 'corporate', 'chuseok', 'valentine']

const OCC_ICONS: Record<OccasionKey, string> = {
  birthday:  '🎂',
  opening:   '🎋',
  wedding:   '💍',
  corporate: '💼',
  chuseok:   '🍂',
  valentine: '💝',
}

// ─── Products (24 items) ──────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  // ── Bouquets – Birthday / Valentine ────────────────────────────────────────
  {
    id: 1, nameVi: 'Bó Hồng Phấn Premium 24 Bông', nameKo: '프리미엄 핑크 장미 24송이',
    price: 850000, originalPrice: 1000000,
    occasions: ['birthday', 'valentine'], category: 'bouquet',
    img: 'https://images.unsplash.com/photo-1680563094046-5d846e2c59d1?w=500&h=620&fit=crop&auto=format',
    descVi: '24 bông hồng phấn Đà Lạt kết hợp baby\'s breath tinh tế, gói giấy kraft sang trọng.',
    descKo: '달랏산 핑크 장미 24송이, 안개꽃 조합. 크래프트지 고급 포장.',
    meaningVi: 'Hồng phấn — "Lời cảm ơn chân thành và tình yêu dịu dàng."',
    meaningKo: '핑크 장미 꽃말 — "진심 어린 감사와 부드러운 사랑."',
    isPopular: true, stock: 12,
  },
  {
    id: 2, nameVi: 'Bó Tulip Hồng Đà Lạt', nameKo: '달랏 핑크 튤립 꽃다발',
    price: 580000,
    occasions: ['birthday', 'valentine'], category: 'bouquet',
    img: 'https://images.unsplash.com/photo-1490750967868-88df5691cc02?w=500&h=620&fit=crop&auto=format',
    descVi: 'Tulip hồng tươi Đà Lạt, 20 bông, gói giấy trắng tinh.',
    descKo: '달랏 핑크 튤립 20송이. 화이트 래핑.',
    meaningVi: 'Tulip hồng — "Tình yêu trong sáng, chân thành từ trái tim."',
    meaningKo: '핑크 튤립 꽃말 — "순수하고 진실된 사랑."',
    isNew: true, stock: 10,
  },
  {
    id: 3, nameVi: 'Bó Hướng Dương Tươi Sáng', nameKo: '밝은 해바라기 꽃다발',
    price: 450000,
    occasions: ['birthday', 'chuseok'], category: 'bouquet',
    img: 'https://images.unsplash.com/photo-1644248422980-8e0eb75a1557?w=500&h=620&fit=crop&auto=format',
    descVi: 'Hoa hướng dương tươi, gói giấy lụa vàng. Năng lượng hạnh phúc.',
    descKo: '해바라기 꽃다발, 노란 실크 포장.',
    meaningVi: 'Hướng dương — "Lòng trung thành và niềm vui bất tận."',
    meaningKo: '해바라기 꽃말 — "충성심과 끝없는 기쁨."',
    stock: 20,
  },
  {
    id: 4, nameVi: 'Bó Hoa Ly Trắng Tinh', nameKo: '순백 백합 꽃다발',
    price: 680000, originalPrice: 760000,
    occasions: ['birthday', 'wedding'], category: 'bouquet',
    img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&h=620&fit=crop&auto=format',
    descVi: 'Hoa ly trắng thuần khiết, 12 bông. Trang nhã và sang trọng.',
    descKo: '흰 백합 12송이. 우아하고 고급스러운.',
    meaningVi: 'Hoa ly — "Thuần khiết và tình yêu vĩnh cửu."',
    meaningKo: '백합 꽃말 — "순결함과 영원한 사랑."',
    stock: 6,
  },
  {
    id: 5, nameVi: 'Bó Lavender Mix Mộng Mơ', nameKo: '라벤더 믹스 꽃다발',
    price: 490000, originalPrice: 540000,
    occasions: ['birthday', 'valentine'], category: 'bouquet',
    img: 'https://images.unsplash.com/photo-1521334726092-b509a19597c6?w=500&h=620&fit=crop&auto=format',
    descVi: 'Hoa lavender mix, gói giấy xám bạc tinh tế.',
    descKo: '라벤더 믹스, 실버 그레이 래핑.',
    meaningVi: 'Lavender — "Tình yêu thuần khiết và ký ức ngọt ngào."',
    meaningKo: '라벤더 꽃말 — "순수한 사랑과 달콤한 기억."',
    stock: 14,
  },
  {
    id: 6, nameVi: 'Bó Hoa Mùa Xuân Đa Sắc', nameKo: '봄 믹스 꽃다발',
    price: 480000,
    occasions: ['birthday'], category: 'bouquet',
    img: 'https://images.unsplash.com/photo-1589131854040-89f700aeafcd?w=500&h=620&fit=crop&auto=format',
    descVi: 'Hoa mùa xuân đa sắc: hồng, vàng, trắng. Tươi và vui tươi.',
    descKo: '봄 믹스 꽃다발: 핑크, 노랑, 화이트.',
    meaningVi: 'Hoa xuân — "Khởi đầu mới, hy vọng và niềm vui rộn ràng."',
    meaningKo: '봄꽃 꽃말 — "새로운 시작, 희망, 기쁨."',
    isNew: true, stock: 15,
  },
  {
    id: 7, nameVi: 'Bó Cẩm Chướng Tình Mẫu Tử', nameKo: '카네이션 꽃다발',
    price: 380000, originalPrice: 420000,
    occasions: ['birthday', 'chuseok'], category: 'bouquet',
    img: 'https://images.unsplash.com/photo-1562519422-ced6a0e2f5b4?w=500&h=620&fit=crop&auto=format',
    descVi: 'Cẩm chướng nhiều màu, gói giấy kraft. Ý nghĩa tình mẫu tử.',
    descKo: '다양한 색의 카네이션.',
    meaningVi: 'Cẩm chướng — "Tình mẫu tử thiêng liêng, yêu thương vô điều kiện."',
    meaningKo: '카네이션 꽃말 — "어머니의 사랑, 무조건적인 사랑."',
    stock: 18,
  },
  {
    id: 8, nameVi: 'Bó 99 Hoa Hồng Đỏ', nameKo: '빨간 장미 99송이',
    price: 2900000, originalPrice: 3300000,
    occasions: ['valentine', 'birthday'], category: 'bouquet',
    img: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=500&h=620&fit=crop&auto=format',
    descVi: '99 bông hồng đỏ — biểu tượng tình yêu vĩnh cửu. Gói hộp trái tim.',
    descKo: '빨간 장미 99송이 — 영원한 사랑의 상징.',
    meaningVi: 'Hồng đỏ — "Tình yêu đích thực và đam mê cháy bỏng."',
    meaningKo: '빨간 장미 꽃말 — "진실한 사랑과 열정."',
    isPopular: true, stock: 8,
  },
  // ── Boxes ──────────────────────────────────────────────────────────────────
  {
    id: 9, nameVi: 'Hộp Hoa Mix Pastel', nameKo: '파스텔 믹스 꽃 박스',
    price: 650000,
    occasions: ['birthday', 'corporate'], category: 'box',
    img: 'https://images.unsplash.com/photo-1644248423441-bc7c5dcebeb6?w=500&h=620&fit=crop&auto=format',
    descVi: 'Hộp hoa tông pastel: hồng nhạt, lavender, trắng kem. Kèm thiệp viết tay.',
    descKo: '파스텔 톤 꽃 박스. 손편지 카드 포함.',
    meaningVi: 'Lavender — "Sự thuần khiết và bình yên trong tâm hồn."',
    meaningKo: '라벤더 꽃말 — "순수함과 마음의 평온."',
    isNew: true, stock: 8,
  },
  {
    id: 10, nameVi: 'Hộp Quà Doanh Nghiệp Premium', nameKo: '프리미엄 기업용 꽃 선물 세트',
    price: 1200000, originalPrice: 1290000,
    occasions: ['corporate', 'opening'], category: 'box',
    img: 'https://images.unsplash.com/photo-1667010723263-8ad9a8f5f6c6?w=500&h=620&fit=crop&auto=format',
    descVi: 'Hộp hoa kèm chocolat & thiệp in logo doanh nghiệp. Giao tận văn phòng.',
    descKo: '꽃 박스 + 초콜릿 + 로고 카드. 사무실 배달.',
    meaningVi: 'Hoa doanh nghiệp — "Sự trân trọng và mối quan hệ bền vững."',
    meaningKo: '기업 선물 꽃말 — "감사함과 지속적인 파트너십."',
    isPopular: true, stock: 10,
  },
  {
    id: 11, nameVi: 'Hộp Hoa Cao Cấp VIP', nameKo: 'VIP 고급 꽃 박스',
    price: 1500000,
    occasions: ['corporate', 'wedding'], category: 'box',
    img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=500&h=620&fit=crop&auto=format',
    descVi: 'Hộp hoa sang trọng tông nude & trắng. Dành cho đối tác VIP.',
    descKo: '누드 & 화이트 톤 고급 꽃 박스. VIP 파트너용.',
    meaningVi: 'Hoa VIP — "Sự kính trọng và tình cảm sâu sắc nhất."',
    meaningKo: '고급 꽃 꽃말 — "최고의 존경과 깊은 감사."',
    isPopular: true, stock: 6,
  },
  {
    id: 12, nameVi: 'Hộp Hoa Khô Lãng Mạn', nameKo: '로맨틱 드라이 플라워 박스',
    price: 390000,
    occasions: ['valentine', 'birthday'], category: 'box',
    img: 'https://images.unsplash.com/photo-1644248423441-bc7c5dcebeb6?w=500&h=620&fit=crop&auto=format&crop=right',
    descVi: 'Hộp hoa khô: hồng khô, lavender, rơm vàng. Lưu giữ mãi mãi.',
    descKo: '드라이 플라워 박스: 말린 장미, 라벤더, 밀짚.',
    meaningVi: 'Hoa khô — "Tình yêu vĩnh cửu, kỷ niệm không phai."',
    meaningKo: '드라이 플라워 꽃말 — "영원한 사랑, 지워지지 않는 기억."',
    isNew: true, stock: 20,
  },
  // ── Baskets ────────────────────────────────────────────────────────────────
  {
    id: 13, nameVi: 'Giỏ Hoa Cúc Vàng Chuseok', nameKo: '추석 노란 국화 꽃 바구니',
    price: 520000,
    occasions: ['chuseok', 'corporate'], category: 'basket',
    img: 'https://images.unsplash.com/photo-1689061732262-2f8a68fa99cb?w=500&h=620&fit=crop&auto=format',
    descVi: 'Giỏ cúc vàng rực rỡ, biểu tượng may mắn trong văn hoá Hàn Quốc.',
    descKo: '추석 노란 국화 바구니, 행운의 상징.',
    meaningVi: 'Cúc vàng — "Trường thọ, may mắn và tình gia đình ấm áp."',
    meaningKo: '국화 꽃말 — "장수, 행운, 따뜻한 가족애."',
    stock: 15,
  },
  {
    id: 14, nameVi: 'Giỏ Truyền Thống Chuseok', nameKo: '전통 추석 꽃 바구니',
    price: 620000,
    occasions: ['chuseok'], category: 'basket',
    img: 'https://images.unsplash.com/photo-1689061732262-2f8a68fa99cb?w=500&h=620&fit=crop&auto=format&crop=right',
    descVi: 'Giỏ hoa truyền thống Chuseok: cúc vàng, cúc trắng. Tặng gia đình.',
    descKo: '전통 추석 꽃 바구니: 노란 국화, 흰 국화. 가족 선물.',
    isNew: true, stock: 11,
  },
  {
    id: 15, nameVi: 'Giỏ Hortensia Xanh Nhẹ', nameKo: '연청 수국 꽃 바구니',
    price: 750000, originalPrice: 840000,
    occasions: ['corporate', 'birthday'], category: 'basket',
    img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&h=620&fit=crop&auto=format&crop=right',
    descVi: 'Giỏ hoa cẩm tú cầu xanh nhạt thanh lịch. Phù hợp văn phòng.',
    descKo: '연청 수국 꽃 바구니. 사무실에 적합.',
    meaningVi: 'Cẩm tú cầu — "Sự ơn ân và lòng biết ơn sâu sắc."',
    meaningKo: '수국 꽃말 — "은혜와 깊은 감사."',
    isPopular: true, stock: 9,
  },
  // ── Stands – Opening ────────────────────────────────────────────────────────
  {
    id: 16, nameVi: 'Kệ Khai Trương 2 Tầng Premium', nameKo: '2단 프리미엄 개업 화환',
    price: 1800000, originalPrice: 2250000,
    occasions: ['opening'], category: 'stand',
    img: 'https://images.unsplash.com/photo-1760618511409-9d80f26e36f4?w=500&h=620&fit=crop&auto=format',
    descVi: 'Kệ 2 tầng sang trọng, chữ vàng theo yêu cầu. Khai trương văn phòng, nhà hàng.',
    descKo: '2단 고급 화환, 맞춤 금박 문구.',
    meaningVi: 'Hoa khai trương — "Chúc mừng khởi đầu mới, thịnh vượng."',
    meaningKo: '개업 화환 — "새로운 시작, 번영 기원."',
    isPopular: true, stock: 5,
  },
  {
    id: 17, nameVi: 'Kệ Khai Trương 3 Tầng Vàng', nameKo: '3단 골드 개업 화환',
    price: 2800000, originalPrice: 3500000,
    occasions: ['opening'], category: 'stand',
    img: 'https://images.unsplash.com/photo-1760618511409-9d80f26e36f4?w=500&h=620&fit=crop&auto=format&crop=entropy',
    descVi: 'Kệ 3 tầng đại sang, hoa cúc vàng tươi. Dành cho khai trương lớn.',
    descKo: '3단 대형 화환, 노란 국화. 대규모 개업에 적합.',
    isPopular: true, stock: 3,
  },
  {
    id: 18, nameVi: 'Chậu Lan Hồ Điệp Cao Cấp', nameKo: '고급 호접란 화분',
    price: 1100000, originalPrice: 1220000,
    occasions: ['opening', 'corporate'], category: 'stand',
    img: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=500&h=620&fit=crop&auto=format',
    descVi: 'Lan hồ điệp trắng hoặc tím theo yêu cầu. Biểu tượng may mắn, trường thọ.',
    descKo: '흰색 또는 보라색 호접란. 행운의 상징.',
    meaningVi: 'Lan hồ điệp — "Thanh lịch, may mắn và trường thọ."',
    meaningKo: '호접란 꽃말 — "우아함, 행운, 장수."',
    stock: 6,
  },
  {
    id: 19, nameVi: 'Kệ Hoa Khai Trương Classic', nameKo: '클래식 개업 화환',
    price: 1650000,
    occasions: ['opening'], category: 'stand',
    img: 'https://images.unsplash.com/photo-1760618511409-9d80f26e36f4?w=500&h=620&fit=crop&auto=format&crop=faces',
    descVi: 'Kệ hoa classic, hoa hỗn hợp tươi. Phù hợp mọi loại cơ sở kinh doanh.',
    descKo: '클래식 화환, 혼합 신선 꽃.',
    isNew: true, stock: 7,
  },
  // ── Stands – Birthday ───────────────────────────────────────────────────────
  {
    id: 20, nameVi: 'Kệ Hoa Sinh Nhật Hàn Quốc', nameKo: '한국 스타일 생일 화환',
    price: 950000,
    occasions: ['birthday'], category: 'stand',
    img: 'https://images.unsplash.com/photo-1652346107876-58d7354ce9b8?w=500&h=620&fit=crop&auto=format',
    descVi: 'Kệ sinh nhật phong cách Hàn Quốc hiện đại. In tên và lời chúc theo yêu cầu.',
    descKo: '한국 스타일 생일 화환. 이름과 메시지 맞춤.',
    meaningVi: 'Hoa sinh nhật — "Chúc mừng hành trình tiếp theo đầy yêu thương."',
    meaningKo: '생일 화환 — "다음 여정도 사랑으로 가득하길."',
    isPopular: true, stock: 4,
  },
  // ── Wedding ────────────────────────────────────────────────────────────────
  {
    id: 21, nameVi: 'Bó Cầm Tay Cô Dâu Thuần Trắng', nameKo: '신부 순백 부케',
    price: 720000,
    occasions: ['wedding'], category: 'bouquet',
    img: 'https://images.unsplash.com/photo-1652346072098-cfc2e94d30e7?w=500&h=620&fit=crop&auto=format',
    descVi: 'Bó hoa trắng: hoa ly, hồng trắng, baby breath. Cho ngày trọng đại.',
    descKo: '흰 부케: 백합, 흰 장미, 안개꽃.',
    meaningVi: 'Hoa ly trắng — "Thuần khiết, trang nghiêm và tình yêu vĩnh cửu."',
    meaningKo: '흰 백합 꽃말 — "순결함과 영원한 사랑."',
    isNew: true, stock: 6,
  },
  {
    id: 22, nameVi: 'Bó Cưới Hồng Ngọt Ngào', nameKo: '달콤한 핑크 웨딩 부케',
    price: 890000, originalPrice: 990000,
    occasions: ['wedding'], category: 'bouquet',
    img: 'https://images.unsplash.com/photo-1520763185298-128e5c58a49a?w=500&h=620&fit=crop&auto=format',
    descVi: 'Bó cầm tay cô dâu tông hồng ngọt. Hoa hồng, mẫu đơn, baby breath.',
    descKo: '달콤한 핑크 웨딩 부케. 장미, 모란, 안개꽃.',
    meaningVi: 'Mẫu đơn — "Hạnh phúc viên mãn và tình yêu thịnh vượng."',
    meaningKo: '모란 꽃말 — "행복한 결혼, 번성하는 사랑."',
    isNew: true, stock: 5,
  },
  {
    id: 23, nameVi: 'Bó Mẫu Đơn Hồng Cao Cấp', nameKo: '프리미엄 모란 꽃다발',
    price: 1200000,
    occasions: ['wedding', 'valentine'], category: 'bouquet',
    img: 'https://images.unsplash.com/photo-1530092285049-1c42085fd395?w=500&h=620&fit=crop&auto=format',
    descVi: 'Mẫu đơn hồng đậm, sang trọng và quyến rũ. Biểu tượng hạnh phúc.',
    descKo: '깊은 핑크 모란, 고급스럽고 매혹적.',
    meaningVi: 'Mẫu đơn — "Tình yêu bền vững và sự phồn thịnh viên mãn."',
    meaningKo: '모란 꽃말 — "영속적인 사랑과 번영."',
    isPopular: true, stock: 8,
  },
  {
    id: 24, nameVi: 'Giỏ Hortensia Tím Mộng', nameKo: '보라 수국 꽃 바구니',
    price: 680000, originalPrice: 750000,
    occasions: ['wedding', 'birthday'], category: 'basket',
    img: 'https://images.unsplash.com/photo-1496661415325-ef852f9e8e7c?w=500&h=620&fit=crop&auto=format',
    descVi: 'Giỏ cẩm tú cầu tím mộng mơ, dây ruy băng be. Tinh tế và lãng mạn.',
    descKo: '보라 수국 꽃 바구니, 베이지 리본.',
    meaningVi: 'Cẩm tú cầu tím — "Sự hiểu biết sâu sắc và tình yêu chân thành."',
    meaningKo: '보라 수국 꽃말 — "깊은 이해와 진심 어린 사랑."',
    isPopular: true, stock: 7,
  },
]

// ─── i18n ─────────────────────────────────────────────────────────────────────
const T = {
  vi: {
    brand: 'Hoa Tươi',
    tagline: 'Giao hàng trong ngày · Hoa Đà Lạt',
    announce: '🌸  Hotline: 0901 234 567  ·  KakaoTalk: hoatuoivn  ·  Giao nội thành 2–4 giờ  ·  Miễn phí giao đơn từ 800.000đ',
    navSale: 'Đang Giảm Giá',
    search: 'Tìm kiếm hoa...',
    sections: {
      sale:    { title: 'Đang Giảm Giá',   sub: 'Ưu đãi đặc biệt' },
      popular: { title: 'Mua Nhiều Nhất',  sub: 'Được yêu thích nhất' },
      newest:  { title: 'Sản Phẩm Mới',    sub: 'Mới về tháng này' },
    },
    viewAll: 'Xem tất cả →',
    addCart: 'Đặt hoa',
    shopTitle: 'Tất cả sản phẩm',
    filterAll: 'Tất cả',
    filterCats: { bouquet: 'Bó hoa', box: 'Hộp hoa', basket: 'Giỏ hoa', stand: 'Kệ hoa' },
    meaning: 'Hoa ngữ',
    stock: (n: number) => `Còn ${n} sản phẩm`,
    outOfStock: 'Hết hàng',
    badge: { new: 'Mới', popular: 'Bán chạy' },
    cart: { title: 'Giỏ hàng', empty: 'Giỏ hàng đang trống — hãy chọn một bó hoa.', emptyAction: 'Khám phá cửa hàng', checkout: 'Tiến hành thanh toán', total: 'Tổng cộng', note: 'Ghi chú cho bó hoa này', remove: 'Xoá' },
    checkout: { title: 'Thanh toán', name: 'Họ và tên', phone: 'Số điện thoại', address: 'Địa chỉ giao hàng', delivery: 'Ngày giao hàng', time: 'Khung giờ giao', message: 'Lời nhắn trên thiệp', messageHint: 'Sẽ được viết tay lên thiệp kèm hoa.', payment: 'Phương thức thanh toán', payOptions: ['Chuyển khoản ngân hàng', 'Momo / ZaloPay', 'Tiền mặt khi nhận hàng'], confirm: 'Xác nhận đặt hoa', success: 'Đặt hoa thành công!', successMsg: 'Chúng tôi sẽ liên hệ xác nhận trong 30 phút. Cảm ơn bạn!' },
    trust: [
      { icon: '🌿', t: 'Hoa tươi mỗi ngày',    d: 'Nhập trực tiếp từ Đà Lạt — tươi 5–7 ngày.' },
      { icon: '🇰🇷', t: 'Phục vụ song ngữ',     d: 'Đội ngũ hiểu phong cách tặng quà Hàn Quốc.' },
      { icon: '⚡', t: 'Giao hàng nhanh',       d: 'Giao trong 2–4 giờ tại nội thành HN & HCM.' },
      { icon: '✏️', t: 'Thiết kế theo yêu cầu', d: 'Tư vấn và làm riêng cho mọi dịp lễ.' },
    ],
    vnd: 'đ',
    orderSummary: 'Tóm tắt đơn hàng',
    backHome: 'Về trang chủ',
    footer: { hotline: 'Hotline: 0901 234 567', kakao: 'KakaoTalk: hoatuoivn', deliver: 'Giao hàng toàn quốc', rights: 'Bản quyền thuộc về chúng tôi' },
    heroSlides: [
      { eyebrow: '— Bộ Sưu Tập', title: 'Hoa Cưới\nCầm Tay', sub: 'Freeship & Tặng hoa cài áo chú rể', cta: 'Xem ngay', img: 'https://images.unsplash.com/photo-1652346072098-cfc2e94d30e7?w=1400&h=580&fit=crop&auto=format', accent: '#D9A6A0' },
      { eyebrow: '— Ưu Đãi Hôm Nay', title: 'Giảm Đến\n25%', sub: 'Hoa tươi Đà Lạt, giao trong ngày, giá tốt nhất', cta: 'Khám phá', img: 'https://images.unsplash.com/photo-1680563094046-5d846e2c59d1?w=1400&h=580&fit=crop&auto=format', accent: '#D9A6A0' },
      { eyebrow: '— Khai Trương', title: 'Hoa Kệ\n2 & 3 Tầng', sub: 'Thiết kế theo yêu cầu, in chữ vàng', cta: 'Đặt ngay', img: 'https://images.unsplash.com/photo-1760618511409-9d80f26e36f4?w=1400&h=580&fit=crop&auto=format', accent: '#5F6F52' },
    ],
  },
  ko: {
    brand: '플라워 베트남',
    tagline: '당일 배달 · 달랏 신선 꽃',
    announce: '🌸  핫라인: 0901 234 567  ·  카카오톡: hoatuoivn  ·  시내 2–4시간 배달  ·  800,000₫ 이상 무료 배달',
    navSale: '할인 상품',
    search: '꽃 검색...',
    sections: {
      sale:    { title: '할인 상품',  sub: '특별 할인' },
      popular: { title: '인기 상품', sub: '가장 사랑받는' },
      newest:  { title: '신상품',    sub: '이번 달 신제품' },
    },
    viewAll: '전체 보기 →',
    addCart: '꽃 담기',
    shopTitle: '전체 상품',
    filterAll: '전체',
    filterCats: { bouquet: '꽃다발', box: '꽃 박스', basket: '꽃 바구니', stand: '화환' },
    meaning: '꽃말',
    stock: (n: number) => `재고: ${n}개`,
    outOfStock: '품절',
    badge: { new: '신상', popular: '인기' },
    cart: { title: '장바구니', empty: '장바구니가 비어있어요 — 꽃을 골라보세요.', emptyAction: '쇼핑하러 가기', checkout: '결제하기', total: '합계', note: '이 꽃다발에 대한 메모', remove: '삭제' },
    checkout: { title: '결제', name: '이름', phone: '전화번호', address: '배송 주소', delivery: '배송 날짜', time: '배송 시간대', message: '카드 메시지', messageHint: '카드에 손으로 작성됩니다.', payment: '결제 방법', payOptions: ['계좌이체', '모모 / 잘로페이', '현금 결제'], confirm: '주문 확인', success: '주문 완료!', successMsg: '30분 이내에 확인 연락을 드리겠습니다. 감사합니다!' },
    trust: [
      { icon: '🌿', t: '매일 신선한 꽃',  d: '달랏에서 직접 공수 — 5–7일 신선.' },
      { icon: '🇰🇷', t: '한국어 서비스', d: '한국 선물 문화를 아는 팀.' },
      { icon: '⚡', t: '빠른 배달',       d: '하노이 & 호치민 2–4시간 배달.' },
      { icon: '✏️', t: '맞춤 디자인',     d: '특별한 날을 위한 맞춤 꽃 디자인.' },
    ],
    vnd: '₫',
    orderSummary: '주문 요약',
    backHome: '홈으로',
    footer: { hotline: '핫라인: 0901 234 567', kakao: '카카오톡: hoatuoivn', deliver: '전국 배달', rights: '모든 권리 보유' },
    heroSlides: [
      { eyebrow: '— 컬렉션', title: '웨딩\n부케', sub: '무료 배달 & 신랑 코사지 증정', cta: '지금 보기', img: 'https://images.unsplash.com/photo-1652346072098-cfc2e94d30e7?w=1400&h=580&fit=crop&auto=format', accent: '#D9A6A0' },
      { eyebrow: '— 오늘의 할인', title: '최대\n25% 할인', sub: '달랏 신선 꽃, 당일 배달, 최저가', cta: '지금 보기', img: 'https://images.unsplash.com/photo-1680563094046-5d846e2c59d1?w=1400&h=580&fit=crop&auto=format', accent: '#D9A6A0' },
      { eyebrow: '— 신상품', title: '개업\n화환 2·3단', sub: '맞춤 금박 문구 제작 가능', cta: '지금 주문', img: 'https://images.unsplash.com/photo-1760618511409-9d80f26e36f4?w=1400&h=580&fit=crop&auto=format', accent: '#5F6F52' },
    ],
  },
} as const

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n)
const discountPct = (p: Product) =>
  p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0

// ─── Announcement Bar ─────────────────────────────────────────────────────────
function AnnouncementBar({ lang }: { lang: Lang }) {
  return (
    <div className="bg-[#6E2A34] text-[#FBF6EF] text-[11px] tracking-wide text-center py-2 px-4">
      {T[lang].announce}
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ lang, setLang, cartCount, page, onNav, onShopOcc, onOpenAuth }: {
  lang: Lang; setLang: (l: Lang) => void; cartCount: number
  page: Page; onNav: (p: Page) => void; onShopOcc: (k: OccasionKey | 'sale') => void
  onOpenAuth: (m: 'login' | 'register') => void
}) {
  const tx = T[lang]
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [userOpen, setUserOpen] = useState(false)
  const vi = lang === 'vi'

  return (
    <div className="bg-[#FBF6EF]">
      {/* ── Main header row (wine bg) ── */}
      <div className="bg-[#6E2A34]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[60px] flex items-center gap-3">

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-1.5 rounded text-white/80 hover:text-white" aria-label="Menu">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>

          {/* Logo */}
          <button onClick={() => onNav('home')} className="flex items-center gap-2 shrink-0 group">
            <span className="text-xl leading-none">🌸</span>
            <div className="flex flex-col leading-none">
              <span className={`text-lg font-bold text-white leading-tight ${lang === 'ko' ? 'font-display-ko' : 'font-display-vi'}`}>{tx.brand}</span>
              <span className="text-[9px] text-white/60 tracking-widest uppercase hidden sm:block">{tx.tagline}</span>
            </div>
          </button>

          {/* Search bar */}
          <div className="flex-1 flex items-center bg-white rounded-lg overflow-hidden h-9 max-w-xl">
            <input
              type="text"
              placeholder={vi ? 'Tìm kiếm hoa, dịp tặng...' : '꽃, 행사 검색...'}
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              className="flex-1 px-4 py-0 text-sm text-[#2B2A26] focus:outline-none placeholder:text-[#B0A699] bg-transparent"
            />
            <button className="px-3 h-full bg-[#5C2129] hover:bg-[#4A1A22] flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            {/* Lang toggle */}
            <button onClick={() => setLang(lang === 'vi' ? 'ko' : 'vi')}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors text-xs font-semibold">
              <span>{lang === 'vi' ? '🇻🇳' : '🇰🇷'}</span>
              <span className="hidden md:inline">{lang === 'vi' ? 'VI' : 'KR'}</span>
              <span className="text-white/40 text-[10px]">⇆</span>
              <span>{lang === 'vi' ? '🇰🇷' : '🇻🇳'}</span>
            </button>

            {/* Cart */}
            <button onClick={() => onNav('cart')} className="relative p-2 text-white/80 hover:text-white hover:bg-white/15 rounded-lg transition-colors" aria-label={vi ? 'Giỏ hàng' : '장바구니'}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#D9A6A0] text-[#2B2A26] text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User / Login button */}
            <div className="relative">
              <button onClick={() => { setUserOpen(!userOpen) }}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white text-[#6E2A34] text-sm font-bold rounded-lg hover:bg-[#F4EDE3] transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {vi ? 'Đăng nhập' : '로그인'}
              </button>
              {/* Mobile user icon */}
              <button onClick={() => setUserOpen(!userOpen)} className="sm:hidden p-2 text-white/80 hover:text-white hover:bg-white/15 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>

              {userOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-2xl border border-[#E4D9C8] overflow-hidden z-50">
                  <div className="px-4 py-3 bg-[#FBF6EF] border-b border-[#E4D9C8]">
                    <p className="text-xs text-[#7A7163]">{vi ? 'Chào mừng bạn!' : '환영합니다!'}</p>
                    <p className={`text-sm font-bold text-[#2B2A26] mt-0.5 ${lang === 'ko' ? 'font-display-ko' : 'font-display-vi'}`}>
                      {vi ? 'Hoa Tươi' : '플라워 베트남'}
                    </p>
                  </div>
                  <div className="py-1">
                    <button onClick={() => { setUserOpen(false); onOpenAuth('login') }} className="w-full text-left px-4 py-2.5 text-sm text-[#2B2A26] hover:bg-[#F4EDE3] hover:text-[#6E2A34] transition-colors flex items-center gap-2.5 font-medium">
                      <svg className="w-4 h-4 text-[#5F6F52]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      {vi ? 'Đăng nhập' : '로그인'}
                    </button>
                    <button onClick={() => { setUserOpen(false); onOpenAuth('register') }} className="w-full text-left px-4 py-2.5 text-sm text-[#2B2A26] hover:bg-[#F4EDE3] hover:text-[#6E2A34] transition-colors flex items-center gap-2.5 font-medium">
                      <svg className="w-4 h-4 text-[#5F6F52]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      {vi ? 'Đăng ký' : '회원가입'}
                    </button>
                  </div>
                  <div className="px-4 py-2.5 border-t border-[#E4D9C8]">
                    <p className="text-[10px] text-[#7A7163] leading-relaxed">
                      {vi ? 'Đăng ký để nhận ưu đãi & theo dõi đơn hàng.' : '회원가입 시 특별 혜택 제공.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* ── Sub nav (occasion links) ── */}
      <div className="hidden md:block bg-[#FBF6EF] border-b border-[#E4D9C8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center overflow-x-auto">
          {OCCASION_KEYS.map(k => (
            <button key={k} onClick={() => onShopOcc(k)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 text-[11px] font-semibold uppercase tracking-wide hover:text-[#6E2A34] hover:bg-[#F4EDE3] transition-colors whitespace-nowrap relative group ${page === 'shop' ? 'text-[#6E2A34] font-bold' : 'text-[#2B2A26]'}`}>
              <span className="text-sm">{OCC_ICONS[k]}</span>
              {OCC[k][lang]}
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6E2A34] scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-200 rounded-full" />
            </button>
          ))}
          <button onClick={() => onShopOcc('sale')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#6E2A34] hover:bg-[#F4EDE3] transition-colors whitespace-nowrap relative group">
            🔥 {tx.navSale}
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6E2A34] scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-200 rounded-full" />
          </button>
          <div className="flex-1" />
          <a href="/admin"
            className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold text-[#7A7163] hover:text-[#2B2A26] hover:bg-[#F0E8DC] rounded transition-colors whitespace-nowrap">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {vi ? 'Quản lý' : '관리자'}
          </a>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#E4D9C8] bg-[#FBF6EF] px-4 py-3 flex flex-col gap-1">
          <button onClick={() => setLang(lang === 'vi' ? 'ko' : 'vi')} className="text-sm text-left py-2 px-3 rounded-lg text-[#2B2A26] hover:bg-[#F4EDE3] font-medium">
            {lang === 'vi' ? '🇻🇳 Tiếng Việt  →  🇰🇷 한국어' : '🇰🇷 한국어  →  🇻🇳 Tiếng Việt'}
          </button>
          <div className="h-px bg-[#E4D9C8] my-1" />
          {OCCASION_KEYS.map(k => (
            <button key={k} onClick={() => { onShopOcc(k); setMenuOpen(false) }}
              className="text-sm text-left py-2 px-3 rounded-lg text-[#2B2A26] hover:bg-[#F4EDE3] transition-colors flex items-center gap-2.5">
              <span>{OCC_ICONS[k]}</span> {OCC[k][lang]}
            </button>
          ))}
          <button onClick={() => { onShopOcc('sale'); setMenuOpen(false) }}
            className="text-sm text-left py-2 px-3 rounded-lg text-[#6E2A34] font-bold hover:bg-[#F4EDE3] flex items-center gap-2">
            🔥 {tx.navSale}
          </button>
          <div className="h-px bg-[#E4D9C8] my-1" />
          <button onClick={() => { setMenuOpen(false); onOpenAuth('login') }} className="text-sm text-left py-2 px-3 rounded-lg text-[#2B2A26] hover:bg-[#F4EDE3] font-medium">{vi ? '🔑 Đăng nhập' : '🔑 로그인'}</button>
          <button onClick={() => { setMenuOpen(false); onOpenAuth('register') }} className="text-sm text-left py-2 px-3 rounded-lg text-[#2B2A26] hover:bg-[#F4EDE3] font-medium">{vi ? '✨ Đăng ký' : '✨ 회원가입'}</button>
        </div>
      )}

      {userOpen && <div className="fixed inset-0 z-40" onClick={() => setUserOpen(false)} />}
    </div>
  )
}

// ─── Header wrapper (sticky) ──────────────────────────────────────────────────
function SiteHeader(props: Parameters<typeof Navbar>[0] & { onOpenAuth: (m: 'login' | 'register') => void }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 shadow-sm">
      <AnnouncementBar lang={props.lang} />
      <Navbar {...props} />
    </div>
  )
}

// ─── Hero Carousel ────────────────────────────────────────────────────────────
function HeroCarousel({ lang, onNav }: { lang: Lang; onNav: (p: Page) => void }) {
  const slides = T[lang].heroSlides
  const [idx, setIdx] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const next = () => setIdx(i => (i + 1) % slides.length)
  const prev = () => setIdx(i => (i - 1 + slides.length) % slides.length)

  useEffect(() => {
    timerRef.current = setInterval(next, 5000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(next, 5000)
  }

  const slide = slides[idx]

  return (
    <div className="relative overflow-hidden" style={{ height: '520px' }}>
      {/* Background image */}
      <img
        src={slide.img}
        alt={slide.title.replace('\n', ' ')}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        key={idx}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#2B2A26]/80 via-[#2B2A26]/40 to-transparent" />

      {/* Text content */}
      <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-10 flex items-center">
        <div className="max-w-md">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#D9A6A0] mb-4">{slide.eyebrow}</p>
          <h2 className={`text-5xl sm:text-6xl font-bold text-white leading-[1.05] mb-5 whitespace-pre-line ${lang === 'ko' ? 'font-display-ko' : 'font-display-vi'}`}>
            {slide.title}
          </h2>
          <p className="text-sm text-white/75 mb-8 leading-relaxed">{slide.sub}</p>
          <button
            onClick={() => onNav('shop')}
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#6E2A34] text-white text-sm font-semibold rounded-full hover:bg-[#5C2129] transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-white"
          >
            {slide.cta}
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Prev / Next */}
      {[{ fn: prev, label: '‹', side: 'left-4' }, { fn: next, label: '›', side: 'right-4' }].map(btn => (
        <button
          key={btn.side}
          onClick={() => { btn.fn(); resetTimer() }}
          className={`absolute ${btn.side} top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-[#2B2A26]/60 hover:bg-[#6E2A34] text-white text-2xl rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-white`}
          aria-label={btn.label}
        >
          {btn.label}
        </button>
      ))}

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setIdx(i); resetTimer() }}
            className={`rounded-full transition-all focus-visible:outline-2 focus-visible:outline-white ${i === idx ? 'w-6 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/45 hover:bg-white/70'}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, lang, onAdd, onClick }: {
  product: Product; lang: Lang; onAdd: (p: Product) => void; onClick: (p: Product) => void
}) {
  const tx = T[lang]
  const name = lang === 'vi' ? product.nameVi : product.nameKo
  const outOfStock = product.stock === 0
  const pct = discountPct(product)

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-[#E4D9C8] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-[#F4EDE3]" style={{ aspectRatio: '3/4' }}>
        <img
          src={product.img}
          alt={name}
          onClick={() => onClick(product)}
          className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {/* Discount badge */}
        {pct > 0 && (
          <span className="absolute top-2 left-2 bg-[#6E2A34] text-white text-[10px] font-bold px-2 py-0.5 rounded-full leading-tight">
            -{pct}%
          </span>
        )}
        {/* New / Popular badge */}
        {product.isNew && !pct && (
          <span className="absolute top-2 left-2 bg-[#5F6F52] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full leading-tight">
            {tx.badge.new}
          </span>
        )}
        {product.isPopular && !pct && !product.isNew && (
          <span className="absolute top-2 left-2 bg-[#D9A6A0] text-[#2B2A26] text-[10px] font-semibold px-2 py-0.5 rounded-full leading-tight">
            {tx.badge.popular}
          </span>
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-[#FBF6EF]/70 flex items-center justify-center">
            <span className="bg-[#2B2A26] text-white text-xs font-medium px-3 py-1.5 rounded-full">{tx.outOfStock}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <h3
          onClick={() => onClick(product)}
          className="text-[13px] font-medium text-[#2B2A26] text-center leading-snug line-clamp-2 cursor-pointer hover:text-[#6E2A34] transition-colors"
        >
          {name}
        </h3>
        <div className="text-center">
          <span className={`text-base font-semibold text-[#6E2A34] tabular-nums ${lang === 'ko' ? 'font-display-ko' : 'font-display-vi'}`}>
            {fmt(product.price)}{tx.vnd}
          </span>
          {product.originalPrice && (
            <span className="ml-1.5 text-xs text-[#7A7163] line-through tabular-nums">
              {fmt(product.originalPrice)}{tx.vnd}
            </span>
          )}
        </div>
        <button
          disabled={outOfStock}
          onClick={() => onAdd(product)}
          className="mt-auto w-full py-2 text-xs font-bold uppercase tracking-wide rounded-lg bg-[#6E2A34] text-white hover:bg-[#5C2129] transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[#6E2A34]"
        >
          {tx.addCart}
        </button>
      </div>
    </div>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionTitle({ title, sub, lang }: { title: string; sub: string; lang: Lang }) {
  return (
    <div className="text-center mb-8">
      <p className="text-[11px] tracking-[0.25em] uppercase text-[#5F6F52] font-semibold mb-2">{sub}</p>
      <h2 className={`text-3xl sm:text-4xl text-[#2B2A26] inline-block relative pb-2 ${lang === 'ko' ? 'font-display-ko' : 'font-display-vi'}`}>
        {title}
        <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-[#6E2A34] rounded-full" />
      </h2>
    </div>
  )
}

// ─── Product Section ──────────────────────────────────────────────────────────
function ProductSection({ title, sub, products, lang, onAdd, onProductClick, onViewAll, bgClass = '' }: {
  title: string; sub: string; products: Product[]
  lang: Lang; onAdd: (p: Product) => void; onProductClick: (p: Product) => void
  onViewAll: () => void; bgClass?: string
}) {
  const tx = T[lang]
  const visible = products.slice(0, 10)
  if (visible.length === 0) return null
  return (
    <section className={`py-14 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionTitle title={title} sub={sub} lang={lang} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {visible.map(p => (
            <ProductCard key={p.id} product={p} lang={lang} onAdd={onAdd} onClick={onProductClick} />
          ))}
        </div>
        {products.length > 10 && (
          <div className="text-center mt-8">
            <button onClick={onViewAll} className="px-8 py-2.5 border border-[#6E2A34] text-[#6E2A34] text-sm font-semibold rounded-full hover:bg-[#6E2A34] hover:text-white transition-colors">
              {tx.viewAll}
            </button>
          </div>
        )}
        {products.length <= 10 && (
          <div className="text-center mt-8">
            <button onClick={onViewAll} className="text-sm text-[#6E2A34] font-medium hover:underline underline-offset-4 transition-all">
              {tx.viewAll}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

// ─── Trust Section ────────────────────────────────────────────────────────────
function TrustSection({ lang }: { lang: Lang }) {
  return (
    <section className="py-12 border-t border-b border-[#E4D9C8] bg-[#F4EDE3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {T[lang].trust.map(item => (
            <div key={item.t} className="flex flex-col items-center text-center gap-2">
              <span className="text-3xl">{item.icon}</span>
              <h3 className="font-semibold text-[#2B2A26] text-sm">{item.t}</h3>
              <p className="text-xs text-[#7A7163] leading-relaxed">{item.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ lang }: { lang: Lang }) {
  const tx = T[lang]
  return (
    <footer className="bg-[#2B2A26] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌸</span>
              <span className={`text-xl font-semibold ${lang === 'ko' ? 'font-display-ko' : 'font-display-vi'}`}>{tx.brand}</span>
            </div>
            <p className="text-xs text-white/50 leading-relaxed">{tx.footer.deliver}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-white/80">{tx.footer.hotline}</p>
            <p className="text-sm text-white/60">{tx.footer.kakao}</p>
          </div>
          <div className="flex gap-5 items-start">
            {['KakaoTalk', 'Zalo', 'Instagram'].map(s => (
              <a key={s} href="#" className="text-xs text-white/50 hover:text-[#D9A6A0] transition-colors">{s}</a>
            ))}
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-white/40">© 2026 {tx.brand} · {tx.footer.rights}</p>
        </div>
      </div>
    </footer>
  )
}

// ─── Product Detail Page ──────────────────────────────────────────────────────
function ProductDetailPage({ product, lang, onAdd, onNav, onProductClick }: {
  product: Product; lang: Lang; onAdd: (p: Product) => void
  onNav: (p: Page) => void; onProductClick: (p: Product) => void
}) {
  const tx = T[lang]
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState<'detail' | 'meaning' | 'delivery' | 'review'>('detail')
  const [added, setAdded] = useState(false)

  const name = lang === 'vi' ? product.nameVi : product.nameKo
  const desc = lang === 'vi' ? product.descVi : product.descKo
  const meaning = lang === 'vi' ? product.meaningVi : product.meaningKo
  const pct = discountPct(product)

  const similar = PRODUCTS.filter(p =>
    p.id !== product.id &&
    (p.occasions.some(o => product.occasions.includes(o)) || p.category === product.category)
  ).slice(0, 10)

  const benefits = lang === 'vi'
    ? [
        { icon: '🚚', title: 'Giao hoa MIỄN PHÍ', sub: 'Đơn từ 800.000đ' },
        { icon: '🎀', title: 'Tặng kèm THIỆP', sub: 'Viết tay theo yêu cầu' },
        { icon: '⚡', title: 'Giao nhanh 2–4H', sub: 'Nội thành HN & HCM' },
      ]
    : [
        { icon: '🚚', title: '무료 배달', sub: '800,000₫ 이상 주문' },
        { icon: '🎀', title: '카드 증정', sub: '손으로 작성' },
        { icon: '⚡', title: '2–4시간 배달', sub: '하노이 & 호치민' },
      ]

  const vouchers = lang === 'vi'
    ? ['Giảm 50K', 'Giảm 25K', 'Miễn phí ship']
    : ['50K 할인', '25K 할인', '무료 배달']

  const stores = lang === 'vi'
    ? [
        { city: 'TP.HCM', addr: '142 Nguyễn Văn Cừ, Cầu Ông Lãnh', phone: '0901 234 567' },
        { city: 'Hà Nội', addr: '34B Lý Nam Đế, Hoàn Kiếm', phone: '094 200 7921' },
      ]
    : [
        { city: '호치민', addr: '142 응우옌반끄, 까우옹라잉', phone: '0901 234 567' },
        { city: '하노이', addr: '34B 리남데, 호안끼엠', phone: '094 200 7921' },
      ]

  const tabs = lang === 'vi'
    ? [
        { key: 'detail' as const, label: 'Chi tiết sản phẩm' },
        { key: 'meaning' as const, label: 'Hoa ngữ · 꽃말' },
        { key: 'delivery' as const, label: 'Vận chuyển' },
        { key: 'review' as const, label: 'Đánh giá' },
      ]
    : [
        { key: 'detail' as const, label: '상품 상세' },
        { key: 'meaning' as const, label: '꽃말 · Hoa ngữ' },
        { key: 'delivery' as const, label: '배송 안내' },
        { key: 'review' as const, label: '리뷰' },
      ]

  const handleAddCart = () => {
    for (let i = 0; i < qty; i++) onAdd(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const occasionLabel = product.occasions[0] ? OCC[product.occasions[0]]?.[lang] : ''

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-[#7A7163] mb-6 flex items-center gap-1.5 flex-wrap">
        <button onClick={() => onNav('home')} className="hover:text-[#6E2A34] transition-colors">
          {lang === 'vi' ? 'Trang chủ' : '홈'}
        </button>
        <span>›</span>
        <button onClick={() => onNav('shop')} className="hover:text-[#6E2A34] transition-colors">
          {occasionLabel || (lang === 'vi' ? 'Sản phẩm' : '상품')}
        </button>
        <span>›</span>
        <span className="text-[#2B2A26] font-medium line-clamp-1">{name}</span>
      </nav>

      {/* Main detail grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
        {/* Left – image */}
        <div>
          <div className="sticky top-[136px] rounded-2xl overflow-hidden bg-[#F4EDE3]">
            <img
              src={product.img}
              alt={name}
              className="w-full object-cover"
              style={{ aspectRatio: '3/4' }}
            />
          </div>
        </div>

        {/* Right – info */}
        <div className="flex flex-col gap-5">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {product.isNew && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#5F6F52] text-white">{tx.badge.new}</span>
            )}
            {product.isPopular && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#D9A6A0] text-[#2B2A26]">{tx.badge.popular}</span>
            )}
          </div>

          {/* Name */}
          <h1 className={`text-3xl sm:text-4xl text-[#2B2A26] leading-tight ${lang === 'ko' ? 'font-display-ko' : 'font-display-vi'}`}>
            {name}
          </h1>

          {/* Price row */}
          <div className="flex items-center gap-3 flex-wrap">
            {product.originalPrice && (
              <span className="text-[#7A7163] line-through text-lg tabular-nums">
                {fmt(product.originalPrice)}{tx.vnd}
              </span>
            )}
            <span className={`text-3xl font-bold text-[#6E2A34] tabular-nums ${lang === 'ko' ? 'font-display-ko' : 'font-display-vi'}`}>
              {fmt(product.price)}{tx.vnd}
            </span>
            {pct > 0 && (
              <span className="bg-[#6E2A34] text-white text-sm font-bold px-3 py-1 rounded-full">
                -{pct}% {lang === 'vi' ? 'GIẢM' : '할인'}
              </span>
            )}
          </div>
          <p className="text-xs text-[#7A7163] -mt-3">{lang === 'vi' ? 'Giá đã bao gồm VAT' : '부가세 포함 가격'}</p>

          {/* Vouchers */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-[#2B2A26]">{lang === 'vi' ? 'Khuyến mãi:' : '쿠폰:'}</span>
            {vouchers.map(v => (
              <span key={v} className="text-xs font-semibold px-2.5 py-1 border border-[#6E2A34] text-[#6E2A34] rounded-lg cursor-pointer hover:bg-[#6E2A34] hover:text-white transition-colors select-none">
                {v}
              </span>
            ))}
          </div>

          {/* Benefit cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {benefits.map(b => (
              <div key={b.title} className="border border-[#E4D9C8] rounded-xl p-3 text-center bg-white hover:border-[#6E2A34] transition-colors">
                <span className="text-2xl block">{b.icon}</span>
                <p className="text-[11px] font-bold text-[#2B2A26] mt-1.5 leading-tight">{b.title}</p>
                <p className="text-[10px] text-[#7A7163] mt-0.5 leading-tight">{b.sub}</p>
              </div>
            ))}
          </div>

          {/* Store locations */}
          <div>
            <p className="text-xs font-bold text-[#2B2A26] uppercase tracking-wide mb-2">
              {lang === 'vi' ? 'Mua tại cửa hàng:' : '매장 위치:'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {stores.map(s => (
                <div key={s.city} className="border border-[#E4D9C8] rounded-xl p-3 bg-white">
                  <p className="text-[11px] font-semibold text-[#2B2A26] mb-1.5 leading-snug">{s.addr}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-[#6E2A34] font-medium">📞 {s.phone}</span>
                    <span className="text-[11px] text-[#5F6F52] cursor-pointer hover:underline">📍 {lang === 'vi' ? 'Bản đồ' : '지도'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Qty + CTA */}
          <div className="flex gap-3 items-stretch">
            <div className="flex items-center border-2 border-[#E4D9C8] rounded-xl overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-3 hover:bg-[#F4EDE3] text-[#2B2A26] transition-colors font-bold text-lg leading-none">−</button>
              <span className="px-4 font-bold tabular-nums text-[#2B2A26]">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="px-4 py-3 hover:bg-[#F4EDE3] text-[#2B2A26] transition-colors font-bold text-lg leading-none">+</button>
            </div>
            <button
              disabled={product.stock === 0}
              onClick={handleAddCart}
              className={`flex-1 py-3.5 font-bold text-sm uppercase tracking-wider rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                added
                  ? 'bg-[#5F6F52] text-white'
                  : 'bg-[#6E2A34] text-white hover:bg-[#5C2129] hover:-translate-y-0.5 hover:shadow-md'
              }`}
            >
              {added ? '✓' : '🛒'} {added ? (lang === 'vi' ? 'Đã thêm!' : '담겼어요!') : tx.addCart}
            </button>
          </div>

          {/* Flower meaning preview */}
          {meaning && (
            <div className="bg-[#FBF6EF] border border-[#E4D9C8] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span>🌸</span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#5F6F52]">{tx.meaning}</span>
              </div>
              <p className="text-sm text-[#2B2A26] italic leading-relaxed">{meaning}</p>
            </div>
          )}

          {/* Stock */}
          <p className="text-xs text-[#7A7163]">{tx.stock(product.stock)}</p>

          {/* Social contact */}
          <div className="flex gap-3 pt-1">
            {[
              { label: 'Zalo OA', icon: '💬', color: 'border-[#0068FF] text-[#0068FF]' },
              { label: 'Facebook', icon: '📘', color: 'border-[#1877F2] text-[#1877F2]' },
              { label: 'KakaoTalk', icon: '💛', color: 'border-[#FAE100] text-[#2B2A26] bg-[#FAE100]' },
            ].map(s => (
              <a key={s.label} href="#" className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold border-2 rounded-xl transition-colors hover:opacity-80 ${s.color}`}>
                <span>{s.icon}</span> {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs – detail / meaning / delivery / review */}
      <div className="border border-[#E4D9C8] rounded-2xl overflow-hidden mb-14 bg-white">
        <div className="flex overflow-x-auto border-b border-[#E4D9C8]">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3.5 text-sm font-semibold whitespace-nowrap relative transition-colors flex-shrink-0 ${
                activeTab === tab.key
                  ? 'text-[#6E2A34] bg-[#FBF6EF]'
                  : 'text-[#7A7163] hover:text-[#2B2A26] hover:bg-[#F4EDE3]'
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6E2A34] rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === 'detail' && (
            <div className="prose prose-sm max-w-none text-[#2B2A26]">
              <h3 className={`text-xl font-semibold mb-3 ${lang === 'ko' ? 'font-display-ko' : 'font-display-vi'}`}>{name}</h3>
              <p className="text-[#7A7163] leading-relaxed mb-4">{desc}</p>
              <p className="text-[#7A7163] leading-relaxed mb-4">
                {lang === 'vi'
                  ? `Mỗi bó hoa được kết bởi các florist chuyên nghiệp, am hiểu văn hóa tặng quà Hàn Quốc. Hoa được nhập trực tiếp từ Đà Lạt và giao hàng trong ngày để đảm bảo độ tươi tốt nhất.`
                  : `각 꽃다발은 한국 선물 문화를 잘 아는 전문 플로리스트가 제작합니다. 꽃은 달랏에서 직접 수입하여 당일 배달로 최상의 신선도를 보장합니다.`
                }
              </p>
              <h4 className="font-semibold mb-2">{lang === 'vi' ? 'Thông tin liên hệ' : '연락처'}</h4>
              <p className="text-[#7A7163]">Hotline: 0901 234 567 · KakaoTalk: hoatuoivn</p>
            </div>
          )}

          {activeTab === 'meaning' && (
            <div>
              {meaning ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🌸</span>
                    <div>
                      <p className="text-xs font-bold tracking-widest uppercase text-[#5F6F52] mb-1">{tx.meaning}</p>
                      <p className={`text-xl font-semibold text-[#2B2A26] ${lang === 'ko' ? 'font-display-ko' : 'font-display-vi'}`}>{name}</p>
                    </div>
                  </div>
                  <blockquote className="border-l-2 border-[#6E2A34] pl-5 py-2 italic text-[#2B2A26] leading-relaxed text-base bg-[#FBF6EF] rounded-r-xl pr-5">
                    {meaning}
                  </blockquote>
                  <p className="text-sm text-[#7A7163] mt-4 leading-relaxed">
                    {lang === 'vi'
                      ? 'Hiểu ý nghĩa của loài hoa là một phần quan trọng trong văn hóa tặng hoa Hàn Quốc (꽃말). Mỗi loài hoa mang một thông điệp riêng — chọn đúng loài hoa là cách thể hiện sự quan tâm sâu sắc nhất.'
                      : '꽃말을 아는 것은 한국 선물 문화에서 중요한 부분입니다. 각 꽃은 고유한 메시지를 담고 있으며, 올바른 꽃을 선택하는 것이 가장 깊은 배려를 표현하는 방법입니다.'
                    }
                  </p>
                </>
              ) : (
                <p className="text-[#7A7163]">{lang === 'vi' ? 'Chưa có thông tin hoa ngữ.' : '꽃말 정보가 없습니다.'}</p>
              )}
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="space-y-4 text-sm text-[#7A7163] leading-relaxed">
              {(lang === 'vi'
                ? [
                    { icon: '⚡', t: 'Giao nhanh 2–4 giờ', d: 'Áp dụng cho nội thành Hà Nội và TP.HCM. Đặt hàng trước 16:00 được giao trong ngày.' },
                    { icon: '🚚', t: 'Miễn phí giao hàng', d: 'Áp dụng cho đơn hàng từ 800.000đ trở lên tại nội thành.' },
                    { icon: '📦', t: 'Đóng gói chuyên nghiệp', d: 'Hoa được bảo quản trong hộp giữ nhiệt, đảm bảo tươi khi nhận.' },
                    { icon: '📞', t: 'Theo dõi đơn hàng', d: 'Shipper sẽ liên hệ trước khi giao. Hỗ trợ đổi giờ giao linh hoạt.' },
                  ]
                : [
                    { icon: '⚡', t: '2–4시간 배달', d: '하노이 및 호치민 시내 적용. 오후 4시 이전 주문 시 당일 배달 가능.' },
                    { icon: '🚚', t: '무료 배달', d: '시내 800,000₫ 이상 주문 시 무료 배달.' },
                    { icon: '📦', t: '전문 포장', d: '꽃은 보온 박스에 보관하여 신선도를 유지합니다.' },
                    { icon: '📞', t: '주문 추적', d: '배달 전 배달원이 연락드립니다. 유연한 시간 변경 지원.' },
                  ]
              ).map(item => (
                <div key={item.t} className="flex gap-4 p-4 bg-[#FBF6EF] rounded-xl border border-[#E4D9C8]">
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-[#2B2A26] mb-1">{item.t}</p>
                    <p>{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'review' && (
            <div>
              <div className="flex items-center gap-4 mb-6 p-5 bg-[#FBF6EF] rounded-xl border border-[#E4D9C8]">
                <div className="text-center">
                  <p className="text-5xl font-bold text-[#6E2A34]">4.9</p>
                  <p className="text-yellow-400 text-lg mt-1">★★★★★</p>
                  <p className="text-xs text-[#7A7163] mt-1">{lang === 'vi' ? '128 đánh giá' : '128 리뷰'}</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5,4,3,2,1].map(star => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-[#7A7163] w-2">{star}</span>
                      <span className="text-yellow-400 text-xs">★</span>
                      <div className="flex-1 h-1.5 bg-[#E4D9C8] rounded-full overflow-hidden">
                        <div className="h-full bg-[#6E2A34] rounded-full" style={{ width: star === 5 ? '85%' : star === 4 ? '10%' : '3%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Ji-Yeon K.', date: '12/2025', star: 5, text: lang === 'vi' ? 'Hoa đẹp hơn ảnh, giao nhanh và đóng gói cẩn thận. Sẽ quay lại!' : '사진보다 더 예쁘고, 빠르게 배달되었으며 포장도 꼼꼼했습니다. 다시 주문할게요!' },
                  { name: 'Minh T.', date: '11/2025', star: 5, text: lang === 'vi' ? 'Tặng bạn người Hàn, bạn ấy rất thích và bất ngờ. Dịch vụ rất chuyên nghiệp.' : '한국 친구에게 선물했는데 정말 좋아했어요. 서비스가 매우 전문적입니다.' },
                  { name: 'Ha-Eun P.', date: '10/2025', star: 5, text: lang === 'vi' ? 'Thiệp viết tay rất đẹp và ý nghĩa. Hoa tươi được 7 ngày!' : '손편지 카드가 정말 예쁘고 의미 있었어요. 꽃이 7일 동안 신선했어요!' },
                ].map(r => (
                  <div key={r.name} className="p-4 border border-[#E4D9C8] rounded-xl bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#D9A6A0] flex items-center justify-center text-[#6E2A34] font-bold text-sm">
                          {r.name[0]}
                        </div>
                        <span className="font-semibold text-sm text-[#2B2A26]">{r.name}</span>
                      </div>
                      <span className="text-xs text-[#7A7163]">{r.date}</span>
                    </div>
                    <p className="text-yellow-400 text-sm mb-2">{'★'.repeat(r.star)}</p>
                    <p className="text-sm text-[#7A7163] leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Similar products */}
      {similar.length > 0 && (
        <ProductSection
          title={lang === 'vi' ? 'Sản Phẩm Tương Tự' : '유사 상품'}
          sub={lang === 'vi' ? '— Có thể bạn thích' : '— 마음에 드실 수도 있어요'}
          products={similar}
          lang={lang}
          onAdd={onAdd}
          onProductClick={onProductClick}
          onViewAll={() => onNav('shop')}
          bgClass=""
        />
      )}
    </div>
  )
}

// ─── Shop Page ────────────────────────────────────────────────────────────────
// ─── Category descriptions ─────────────────────────────────────────────────────
const OCC_INFO: Record<OccasionKey | 'sale', {
  vi: { title: string; desc: string[] }
  ko: { title: string; desc: string[] }
}> = {
  birthday: {
    vi: {
      title: 'Hoa Sinh Nhật',
      desc: [
        'Những bó hoa, giỏ hoa, lẵng hoa sinh nhật mang đến một buổi sinh nhật thật đặc biệt và ý nghĩa, trao đi sự quan tâm và tình cảm của bạn đối với người nhận.',
        'Nên tặng hoa sinh nhật màu gì? Hoa màu trắng thể hiện sự trân trọng và tình yêu trong sáng. Hoa màu đỏ biểu trưng cho sự chân thành và hạnh phúc. Hoa màu vàng tượng trưng cho sức khỏe, may mắn và tài lộc. Hoa màu hồng mang đến cảm giác yêu thương, dịu dàng. Hoa màu tím thể hiện sự lãng mạn và quyến rũ.',
      ],
    },
    ko: {
      title: '생일 꽃',
      desc: [
        '생일 꽃다발, 바구니는 특별한 생일을 더욱 빛나게 해줍니다. 진심 어린 마음을 꽃으로 전해보세요.',
        '어떤 색의 꽃이 좋을까요? 흰 꽃은 순수한 사랑, 빨간 꽃은 열정과 행복, 노란 꽃은 건강과 행운, 분홍 꽃은 부드러운 사랑, 보라 꽃은 로맨스를 상징합니다.',
      ],
    },
  },
  opening: {
    vi: {
      title: 'Hoa Khai Trương',
      desc: [
        'Hoa khai trương là món quà ý nghĩa gửi tặng đến các đối tác, bạn bè nhân dịp khai trương cửa hàng, văn phòng hay nhà hàng mới.',
        'Kệ hoa khai trương 2–3 tầng với chữ mạ vàng theo yêu cầu tạo ấn tượng hoành tráng. Chậu lan hồ điệp biểu tượng cho sự thịnh vượng và trường thọ — lựa chọn hàng đầu cho không gian doanh nghiệp.',
      ],
    },
    ko: {
      title: '개업 꽃',
      desc: [
        '개업 화환과 꽃은 새로운 가게, 사무실, 레스토랑 오픈을 축하하는 의미 있는 선물입니다.',
        '2~3단 화환에 금박 문구를 넣어 화려함을 더하거나, 호접란 화분으로 번영과 장수를 기원하세요.',
      ],
    },
  },
  wedding: {
    vi: {
      title: 'Hoa Cưới Hỏi',
      desc: [
        'Hoa cưới là biểu tượng của tình yêu và hạnh phúc trong ngày trọng đại nhất của đôi uyên ương.',
        'Từ bó hoa cầm tay cô dâu tinh tế đến các lẵng hoa trang trí sân khấu, hoa bàn tiệc — tất cả đều được làm thủ công tỉ mỉ, đảm bảo ngày cưới của bạn trở nên hoàn hảo và đáng nhớ.',
      ],
    },
    ko: {
      title: '결혼 꽃',
      desc: [
        '웨딩 꽃은 인생 가장 특별한 날을 더욱 빛나게 해주는 사랑과 행복의 상징입니다.',
        '신부 부케부터 무대 장식, 테이블 꽃까지 — 모든 것을 정성스럽게 수작업으로 제작하여 완벽한 결혼식을 만들어 드립니다.',
      ],
    },
  },
  corporate: {
    vi: {
      title: 'Quà Tặng Doanh Nghiệp',
      desc: [
        'Hộp hoa quà tặng doanh nghiệp sang trọng, chuyên nghiệp — thể hiện sự trân trọng đối với đối tác, khách hàng và nhân viên.',
        'In logo doanh nghiệp lên thiệp, tùy chỉnh màu sắc theo thương hiệu. Giao hàng tận văn phòng, đảm bảo đúng giờ và đúng tiêu chuẩn chất lượng.',
      ],
    },
    ko: {
      title: '기업 선물',
      desc: [
        '고급스럽고 전문적인 기업용 꽃 선물 — 파트너, 고객, 직원에 대한 감사함을 표현하세요.',
        '기업 로고 카드 인쇄, 브랜드 컬러 맞춤 제작 가능. 사무실 직접 배달로 정시에 최고 품질을 보장합니다.',
      ],
    },
  },
  chuseok: {
    vi: {
      title: 'Hoa Chuseok 추석',
      desc: [
        'Chuseok (Tết Trung Thu Hàn Quốc) là dịp để tri ân và bày tỏ lòng biết ơn với gia đình, người thân.',
        'Giỏ hoa cúc vàng rực rỡ, giỏ hoa truyền thống — những món quà ý nghĩa mang đậm văn hóa Hàn Quốc, phù hợp biếu tặng cha mẹ, ông bà và đối tác kinh doanh.',
      ],
    },
    ko: {
      title: '추석 꽃',
      desc: [
        '추석은 가족과 지인에게 감사함을 전하는 소중한 명절입니다.',
        '노란 국화 바구니, 전통 꽃 바구니 — 부모님, 조부모님, 비즈니스 파트너에게 한국 문화를 담은 의미 있는 선물을 전해보세요.',
      ],
    },
  },
  valentine: {
    vi: {
      title: 'Valentine · 화이트데이',
      desc: [
        'Hoa Valentine và White Day — cách bày tỏ tình cảm lãng mạn và chân thành nhất với người bạn yêu thương.',
        '99 bông hồng đỏ biểu tượng cho tình yêu vĩnh cửu. Tulip hồng nhẹ nhàng, lavender mộng mơ hay hộp hoa khô lưu giữ mãi mãi — mỗi loài hoa kể một câu chuyện tình yêu riêng.',
      ],
    },
    ko: {
      title: '발렌타인 · 화이트데이',
      desc: [
        '발렌타인데이와 화이트데이 — 사랑하는 사람에게 마음을 전하는 가장 로맨틱한 방법.',
        '빨간 장미 99송이는 영원한 사랑의 상징. 핑크 튤립, 라벤더, 드라이플라워 박스 — 각각의 꽃이 특별한 사랑 이야기를 전합니다.',
      ],
    },
  },
  sale: {
    vi: {
      title: 'Đang Giảm Giá 🔥',
      desc: [
        'Tổng hợp tất cả sản phẩm hoa đang được giảm giá ưu đãi — chất lượng không đổi, giá tốt hơn.',
        'Đặt hàng sớm để không bỏ lỡ những ưu đãi hấp dẫn. Miễn phí giao hàng cho đơn từ 800.000đ.',
      ],
    },
    ko: {
      title: '할인 상품 🔥',
      desc: [
        '현재 할인 중인 모든 꽃 상품 모음 — 품질은 그대로, 가격은 더 합리적으로.',
        '좋은 기회를 놓치지 마세요. 800,000₫ 이상 주문 시 무료 배달.',
      ],
    },
  },
}

function ShopPage({ lang, onAddCart, onProductClick, initOcc, onHome }: {
  lang: Lang; onAddCart: (p: Product) => void; onProductClick: (p: Product) => void
  initOcc?: OccasionKey | 'sale' | null; onHome?: () => void
}) {
  const tx = T[lang]
  const vi = lang === 'vi'
  const [filter, setFilter] = useState<string>('all')
  const [occ, setOcc] = useState<OccasionKey | 'sale' | 'all'>(initOcc ?? 'all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'popular' | 'rating' | 'new' | 'price-asc' | 'price-desc'>('popular')
  const [pageSize, setPageSize] = useState<12 | 24 | 36>(12)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterOpen, setFilterOpen] = useState(false)
  const [priceFilters, setPriceFilters] = useState<string[]>([])
  const [colorFilter, setColorFilter] = useState<string | null>(null)

  const PRICE_RANGES = vi
    ? [{ key: 'low', label: 'Dưới 500.000đ', test: (p: Product) => p.price < 500000 },
       { key: 'mid', label: '500.000đ – 800.000đ', test: (p: Product) => p.price >= 500000 && p.price <= 800000 },
       { key: 'high', label: 'Trên 800.000đ', test: (p: Product) => p.price > 800000 }]
    : [{ key: 'low', label: '50만원 이하', test: (p: Product) => p.price < 500000 },
       { key: 'mid', label: '50만~80만원', test: (p: Product) => p.price >= 500000 && p.price <= 800000 },
       { key: 'high', label: '80만원 이상', test: (p: Product) => p.price > 800000 }]

  const COLORS = [
    { key: 'pink', label: vi ? 'Hồng' : '핑크', hex: '#F4B8CC' },
    { key: 'red', label: vi ? 'Đỏ' : '빨강', hex: '#C0392B' },
    { key: 'white', label: vi ? 'Trắng' : '흰색', hex: '#F5F5F5' },
    { key: 'yellow', label: vi ? 'Vàng' : '노랑', hex: '#F7C948' },
    { key: 'purple', label: vi ? 'Tím' : '보라', hex: '#9B59B6' },
    { key: 'mixed', label: vi ? 'Mix màu' : '혼합', hex: 'linear-gradient(135deg,#F4B8CC,#F7C948,#9B59B6)' },
  ]

  const filtered = PRODUCTS.filter(p => {
    const matchCat = filter === 'all' || p.category === filter
    const matchOcc = occ === 'all' ? true : occ === 'sale' ? !!p.originalPrice : p.occasions.includes(occ as OccasionKey)
    const q = search.toLowerCase()
    const matchSearch = !q || p.nameVi.toLowerCase().includes(q) || p.nameKo.toLowerCase().includes(q)
    const matchPrice = priceFilters.length === 0 || PRICE_RANGES.some(r => priceFilters.includes(r.key) && r.test(p))
    return matchCat && matchOcc && matchSearch && matchPrice
  }).sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price
    if (sort === 'price-desc') return b.price - a.price
    if (sort === 'new') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
    if (sort === 'popular') return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0)
    if (sort === 'rating') return b.stock - a.stock
    return 0
  })

  const totalPages = Math.ceil(filtered.length / pageSize)
  const safePage = Math.min(currentPage, totalPages || 1)
  const displayed = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)
  const categoryInfo = occ !== 'all' ? OCC_INFO[occ][lang] : null

  const togglePrice = (key: string) => {
    setPriceFilters(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
    setCurrentPage(1)
  }

  const hasActiveFilters = priceFilters.length > 0 || colorFilter !== null || filter !== 'all'

  const goPage = (p: number) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return (
    <div className="bg-[#FEFCFA] min-h-screen">
      {/* Filter Drawer Overlay */}
      {filterOpen && (
        <div className="fixed inset-0 z-[90] flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setFilterOpen(false)} />
          <div className="relative w-72 bg-white h-full shadow-2xl flex flex-col overflow-hidden">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E4D9C8]">
              <span className="text-xs font-bold tracking-widest text-[#2B2A26] uppercase">
                {vi ? 'Bộ lọc' : '필터'}
              </span>
              <button onClick={() => setFilterOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F5EFE8] transition-colors text-[#7A7163]">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-7">
              {/* Price */}
              <div>
                <p className="text-[11px] font-bold tracking-widest text-[#2B2A26] uppercase mb-3">
                  {vi ? 'Giá sản phẩm' : '가격'}
                </p>
                <div className="space-y-2.5">
                  {PRICE_RANGES.map(r => (
                    <label key={r.key} className="flex items-center gap-3 cursor-pointer group">
                      <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${priceFilters.includes(r.key) ? 'bg-[#6E2A34] border-[#6E2A34]' : 'border-[#C4B8A8] group-hover:border-[#6E2A34]'}`}
                        onClick={() => togglePrice(r.key)}>
                        {priceFilters.includes(r.key) && (
                          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                            <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className="text-sm text-[#4A4540] group-hover:text-[#6E2A34] transition-colors" onClick={() => togglePrice(r.key)}>
                        {r.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Occasions */}
              <div>
                <p className="text-[11px] font-bold tracking-widest text-[#2B2A26] uppercase mb-3">
                  {vi ? 'Dịp' : '행사'}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setOcc('all')}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${occ === 'all' ? 'bg-[#6E2A34] text-white border-[#6E2A34]' : 'border-[#E4D9C8] text-[#4A4540] hover:border-[#6E2A34]'}`}>
                    {tx.filterAll}
                  </button>
                  {OCCASION_KEYS.map(k => (
                    <button key={k} onClick={() => setOcc(k)}
                      className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${occ === k ? 'bg-[#6E2A34] text-white border-[#6E2A34]' : 'border-[#E4D9C8] text-[#4A4540] hover:border-[#6E2A34]'}`}>
                      {OCC[k][lang]}
                    </button>
                  ))}
                  <button onClick={() => setOcc('sale')}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${occ === 'sale' ? 'bg-[#6E2A34] text-white border-[#6E2A34]' : 'border-[#E4D9C8] text-[#6E2A34] hover:border-[#6E2A34]'}`}>
                    {tx.navSale}
                  </button>
                </div>
              </div>

              {/* Category */}
              <div>
                <p className="text-[11px] font-bold tracking-widest text-[#2B2A26] uppercase mb-3">
                  {vi ? 'Loại hoa' : '종류'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'bouquet', 'box', 'basket', 'stand'] as const).map(cat => (
                    <button key={cat} onClick={() => setFilter(cat)}
                      className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${filter === cat ? 'bg-[#2B2A26] text-white border-[#2B2A26]' : 'border-[#E4D9C8] text-[#4A4540] hover:border-[#2B2A26]'}`}>
                      {cat === 'all' ? tx.filterAll : tx.filterCats[cat]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <p className="text-[11px] font-bold tracking-widest text-[#2B2A26] uppercase mb-3">
                  {vi ? 'Màu sắc' : '색상'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(c => (
                    <button key={c.key} onClick={() => setColorFilter(colorFilter === c.key ? null : c.key)}
                      title={c.label}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-full border transition-colors ${colorFilter === c.key ? 'border-[#6E2A34] bg-[#FBF0F0]' : 'border-[#E4D9C8] hover:border-[#6E2A34]'}`}>
                      <span className="w-3.5 h-3.5 rounded-full flex-shrink-0 border border-white/60 shadow-sm"
                        style={{ background: c.hex.startsWith('linear') ? c.hex : c.hex }} />
                      <span className="text-[#4A4540]">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reset */}
            {hasActiveFilters && (
              <div className="px-6 py-4 border-t border-[#E4D9C8]">
                <button onClick={() => { setFilter('all'); setOcc('all'); setPriceFilters([]); setColorFilter(null) }}
                  className="w-full py-2.5 text-xs font-semibold text-[#6E2A34] border border-[#6E2A34] rounded-full hover:bg-[#6E2A34] hover:text-white transition-colors">
                  {vi ? 'Xóa tất cả bộ lọc' : '필터 초기화'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#7A7163] mb-6">
          <button onClick={onHome} className="hover:text-[#6E2A34] transition-colors font-medium">
            {vi ? 'Trang chủ' : '홈'}
          </button>
          {categoryInfo && (
            <>
              <span className="text-[#C4B8A8]">»</span>
              <span className="font-bold text-[#2B2A26]">{categoryInfo.title}</span>
            </>
          )}
        </nav>

        {/* Category header + description */}
        {categoryInfo && (
          <div className="mb-8">
            <h1 className={`text-3xl sm:text-4xl font-bold text-[#2B2A26] mb-1 inline-block relative pb-2 ${lang === 'ko' ? 'font-display-ko' : 'font-display-vi'}`}>
              {categoryInfo.title}
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6E2A34] rounded-full" />
            </h1>
            <div className="mt-5 bg-white border border-[#E4D9C8] rounded-xl p-5 space-y-2">
              {categoryInfo.desc.map((d, i) => (
                <p key={i} className="text-sm text-[#4A4540] leading-relaxed">{d}</p>
              ))}
            </div>
          </div>
        )}

        {!categoryInfo && (
          <h1 className={`text-4xl text-[#2B2A26] mb-6 ${lang === 'ko' ? 'font-display-ko' : 'font-display-vi'}`}>{tx.shopTitle}</h1>
        )}

        {/* Toolbar row: filter button | show count switcher | sort */}
        <div className="flex items-center gap-3 mb-6 border-t border-b border-[#E4D9C8] py-3">
          {/* Filter button */}
          <button onClick={() => setFilterOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded transition-colors ${hasActiveFilters ? 'border-[#6E2A34] text-[#6E2A34] bg-[#FBF0F0]' : 'border-[#E4D9C8] text-[#4A4540] hover:border-[#6E2A34] hover:text-[#6E2A34]'}`}>
            <svg width="15" height="12" viewBox="0 0 15 12" fill="none" className="flex-shrink-0">
              <path d="M0 1h15M3 6h9M6 11h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {vi ? 'Bộ lọc' : '필터'}
            {hasActiveFilters && (
              <span className="w-4 h-4 rounded-full bg-[#6E2A34] text-white text-[10px] flex items-center justify-center font-bold">
                {priceFilters.length + (colorFilter ? 1 : 0) + (filter !== 'all' ? 1 : 0)}
              </span>
            )}
          </button>

          <span className="text-[#C4B8A8] text-sm">|</span>

          {/* Page size switcher */}
          <div className="flex items-center gap-1 text-sm text-[#7A7163]">
            <span className="mr-1">{vi ? 'Hiển thị:' : '표시:'}</span>
            {([12, 24, 36] as const).map((n, i) => (
              <span key={n} className="flex items-center">
                <button onClick={() => { setPageSize(n); setCurrentPage(1) }}
                  className={`px-1 transition-colors ${pageSize === n ? 'font-bold text-[#2B2A26]' : 'hover:text-[#6E2A34]'}`}>
                  {n}
                </button>
                {i < 2 && <span className="text-[#C4B8A8] mx-0.5">/</span>}
              </span>
            ))}
          </div>

          {/* Result count */}
          <p className="hidden sm:block text-xs text-[#7A7163] ml-1">
            {vi
              ? `(${displayed.length} / ${filtered.length} kết quả)`
              : `(${displayed.length} / ${filtered.length}개)`}
          </p>

          {/* Sort — pushed right */}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-[#7A7163] hidden sm:inline">{vi ? 'Sắp xếp' : '정렬'}</span>
            <select value={sort} onChange={e => setSort(e.target.value as typeof sort)}
              className="text-sm border border-[#E4D9C8] rounded px-3 py-2 bg-white text-[#2B2A26] focus:outline-none focus:border-[#6E2A34] transition-colors cursor-pointer">
              <option value="popular">{vi ? 'Phổ biến' : '인기순'}</option>
              <option value="rating">{vi ? 'Xếp hạng' : '평점순'}</option>
              <option value="new">{vi ? 'Mới nhất' : '최신순'}</option>
              <option value="price-asc">{vi ? 'Giá thấp → cao' : '가격 낮은 순'}</option>
              <option value="price-desc">{vi ? 'Giá cao → thấp' : '가격 높은 순'}</option>
            </select>
          </div>
        </div>

        {displayed.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[#7A7163] mb-3">{vi ? 'Không tìm thấy sản phẩm phù hợp.' : '해당하는 상품이 없습니다.'}</p>
            <button onClick={() => { setFilter('all'); setOcc('all'); setSearch(''); setPriceFilters([]); setColorFilter(null) }}
              className="text-sm text-[#6E2A34] underline underline-offset-2">
              {tx.filterAll}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {displayed.map(p => (
                <ProductCard key={p.id} product={p} lang={lang} onAdd={onAddCart} onClick={onProductClick} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-10">
                {/* Prev */}
                <button onClick={() => goPage(safePage - 1)} disabled={safePage === 1}
                  className="w-9 h-9 flex items-center justify-center rounded border border-[#E4D9C8] text-[#7A7163] hover:border-[#6E2A34] hover:text-[#6E2A34] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M6 1L1 6l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                  const isEllipsis = totalPages > 7 && p !== 1 && p !== totalPages && (p < safePage - 2 || p > safePage + 2)
                  if (isEllipsis) {
                    if (p === safePage - 3 || p === safePage + 3) return <span key={p} className="w-9 h-9 flex items-center justify-center text-[#C4B8A8] text-sm">…</span>
                    return null
                  }
                  return (
                    <button key={p} onClick={() => goPage(p)}
                      className={`w-9 h-9 flex items-center justify-center rounded text-sm font-medium border transition-colors ${safePage === p ? 'bg-[#6E2A34] text-white border-[#6E2A34]' : 'border-[#E4D9C8] text-[#4A4540] hover:border-[#6E2A34] hover:text-[#6E2A34]'}`}>
                      {p}
                    </button>
                  )
                })}

                {/* Next */}
                <button onClick={() => goPage(safePage + 1)} disabled={safePage === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded border border-[#E4D9C8] text-[#7A7163] hover:border-[#6E2A34] hover:text-[#6E2A34] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ─── Cart Page ────────────────────────────────────────────────────────────────
function CartPage({ lang, cart, setCart, onCheckout, onShop }: {
  lang: Lang; cart: CartItem[]; setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
  onCheckout: () => void; onShop: () => void
}) {
  const tx = T[lang]
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)

  const updateQty = (id: number, qty: number) =>
    setCart(c => qty <= 0 ? c.filter(i => i.product.id !== id) : c.map(i => i.product.id === id ? { ...i, qty } : i))
  const updateNote = (id: number, note: string) =>
    setCart(c => c.map(i => i.product.id === id ? { ...i, note } : i))
  const removeItem = (id: number) => setCart(c => c.filter(i => i.product.id !== id))

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0)
  const VAT_RATE = 0.08
  const vat = Math.round(subtotal * VAT_RATE)
  const discount = couponApplied ? Math.round(subtotal * 0.05) : 0
  const total = subtotal + vat - discount
  const isFreeShip = subtotal >= 800000

  const skuCode = (p: Product) => `${p.category.toUpperCase().slice(0, 3)}-${String(p.id).padStart(4, '0')}`

  const vi = lang === 'vi'

  if (cart.length === 0) return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#F4EDE3] flex items-center justify-center">
          <svg className="w-10 h-10 text-[#D9A6A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className={`text-2xl text-[#2B2A26] mb-2 ${lang === 'ko' ? 'font-display-ko' : 'font-display-vi'}`}>
          {vi ? 'Giỏ hàng trống' : '장바구니가 비어있어요'}
        </h2>
        <p className="text-[#7A7163] text-sm mb-8 leading-relaxed">
          {vi ? 'Chưa có sản phẩm nào trong giỏ hàng. Hãy chọn những bó hoa đẹp nhất!' : '아직 장바구니에 상품이 없습니다. 예쁜 꽃을 골라보세요!'}
        </p>
        <button onClick={onShop} className="px-8 py-3 bg-[#6E2A34] text-white font-bold text-sm uppercase tracking-wide rounded-full hover:bg-[#5C2129] transition-colors">
          {tx.cart.emptyAction}
        </button>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 min-h-screen">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`text-3xl sm:text-4xl text-[#2B2A26] ${lang === 'ko' ? 'font-display-ko' : 'font-display-vi'}`}>
            {tx.cart.title}
          </h1>
          <p className="text-sm text-[#7A7163] mt-1">
            {vi ? `${cart.length} sản phẩm trong giỏ hàng` : `장바구니에 ${cart.length}개 상품`}
          </p>
        </div>
        <button onClick={onShop} className="hidden sm:flex items-center gap-1.5 text-sm text-[#7A7163] hover:text-[#6E2A34] transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {vi ? 'Tiếp tục mua sắm' : '계속 쇼핑하기'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* ── Left: Cart table ── */}
        <div className="lg:col-span-2">
          {/* Desktop table */}
          <div className="hidden sm:block bg-white rounded-2xl border border-[#E4D9C8] overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[80px_1fr_100px_120px_110px] gap-0 border-b border-[#E4D9C8] bg-[#F4EDE3]">
              {[
                vi ? 'Hình ảnh' : '사진',
                vi ? 'Sản phẩm' : '상품',
                vi ? 'Số lượng' : '수량',
                vi ? 'Đơn giá' : '단가',
                vi ? 'Tổng cộng' : '합계',
              ].map((h, i) => (
                <div key={h} className={`py-3.5 px-3 text-xs font-bold uppercase tracking-wider text-[#7A7163] ${i >= 2 ? 'text-right' : ''}`}>
                  {h}
                </div>
              ))}
            </div>

            {/* Rows */}
            {cart.map((item, idx) => {
              const name = lang === 'vi' ? item.product.nameVi : item.product.nameKo
              const rowTotal = item.product.price * item.qty
              return (
                <div key={item.product.id}>
                  <div className="grid grid-cols-[80px_1fr_100px_120px_110px] gap-0 items-start py-4">
                    {/* Image */}
                    <div className="px-3">
                      <img src={item.product.img} alt={name} className="w-14 h-14 object-cover rounded-xl bg-[#F4EDE3]" />
                    </div>

                    {/* Name + SKU + Note */}
                    <div className="px-3">
                      <p className="font-semibold text-sm text-[#2B2A26] leading-snug mb-0.5">{name}</p>
                      <p className="text-[11px] text-[#5F6F52] font-mono tracking-wide mb-2">{skuCode(item.product)}</p>
                      <input
                        type="text"
                        placeholder={vi ? 'Ghi chú cho bó hoa này...' : '메모 추가...'}
                        value={item.note}
                        onChange={e => updateNote(item.product.id, e.target.value)}
                        className="w-full text-xs border border-[#E4D9C8] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#6E2A34] transition-colors bg-[#FDFAF6] placeholder:text-[#C4B8A8]"
                      />
                    </div>

                    {/* Qty stepper */}
                    <div className="px-3 flex flex-col items-end gap-2">
                      <div className="flex items-center border border-[#E4D9C8] rounded-lg overflow-hidden">
                        <button onClick={() => updateQty(item.product.id, item.qty - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-[#F4EDE3] text-[#2B2A26] transition-colors font-semibold text-sm">−</button>
                        <span className="w-8 text-center text-sm font-bold tabular-nums text-[#2B2A26]">{item.qty}</span>
                        <button onClick={() => updateQty(item.product.id, item.qty + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-[#F4EDE3] text-[#2B2A26] transition-colors font-semibold text-sm">+</button>
                      </div>
                      <button onClick={() => removeItem(item.product.id)}
                        className="flex items-center gap-1 text-[10px] text-[#7A7163] hover:text-[#6E2A34] transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {vi ? 'Xoá' : '삭제'}
                      </button>
                    </div>

                    {/* Unit price */}
                    <div className="px-3 text-right">
                      <p className="text-sm font-semibold text-[#2B2A26] tabular-nums">{fmt(item.product.price)}{tx.vnd}</p>
                      {item.product.originalPrice && (
                        <p className="text-xs text-[#7A7163] line-through tabular-nums">{fmt(item.product.originalPrice)}{tx.vnd}</p>
                      )}
                      <p className="text-[10px] text-[#5F6F52] mt-0.5">{vi ? 'Đã gồm VAT' : 'VAT 포함'}</p>
                    </div>

                    {/* Row total */}
                    <div className="px-3 text-right">
                      <p className={`text-base font-bold text-[#6E2A34] tabular-nums ${lang === 'ko' ? 'font-display-ko' : 'font-display-vi'}`}>
                        {fmt(rowTotal)}{tx.vnd}
                      </p>
                    </div>
                  </div>

                  {idx < cart.length - 1 && <div className="border-t border-[#E4D9C8] mx-3" />}
                </div>
              )
            })}
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {cart.map(item => {
              const name = lang === 'vi' ? item.product.nameVi : item.product.nameKo
              return (
                <div key={item.product.id} className="bg-white rounded-2xl border border-[#E4D9C8] p-4">
                  <div className="flex gap-3 mb-3">
                    <img src={item.product.img} alt={name} className="w-16 h-16 object-cover rounded-xl bg-[#F4EDE3] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="font-semibold text-sm text-[#2B2A26] leading-snug">{name}</p>
                          <p className="text-[10px] text-[#5F6F52] font-mono mt-0.5">{skuCode(item.product)}</p>
                        </div>
                        <button onClick={() => removeItem(item.product.id)} className="text-[#7A7163] hover:text-[#6E2A34] transition-colors p-0.5 shrink-0">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className={`text-[#6E2A34] font-bold tabular-nums mt-1 ${lang === 'ko' ? 'font-display-ko' : 'font-display-vi'}`}>
                        {fmt(item.product.price * item.qty)}{tx.vnd}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-[#E4D9C8] rounded-lg overflow-hidden">
                      <button onClick={() => updateQty(item.product.id, item.qty - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-[#F4EDE3] transition-colors font-semibold">−</button>
                      <span className="w-8 text-center text-sm font-bold tabular-nums">{item.qty}</span>
                      <button onClick={() => updateQty(item.product.id, item.qty + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-[#F4EDE3] transition-colors font-semibold">+</button>
                    </div>
                    <span className="text-xs text-[#7A7163]">{fmt(item.product.price)}{tx.vnd} / {vi ? 'cái' : '개'}</span>
                  </div>
                  <input type="text" placeholder={vi ? 'Ghi chú...' : '메모...'} value={item.note}
                    onChange={e => updateNote(item.product.id, e.target.value)}
                    className="mt-3 w-full text-xs border border-[#E4D9C8] rounded-lg px-3 py-2 focus:outline-none focus:border-[#6E2A34] bg-[#FDFAF6]" />
                </div>
              )
            })}
          </div>

          {/* Bottom actions row */}
          <div className="flex items-center justify-between mt-5">
            <button onClick={onShop} className="flex items-center gap-1.5 px-5 py-2.5 border border-[#E4D9C8] text-sm text-[#7A7163] hover:text-[#6E2A34] hover:border-[#6E2A34] rounded-full transition-colors font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {vi ? 'Tiếp tục mua sắm' : '계속 쇼핑하기'}
            </button>
            <button onClick={() => setCart([])} className="text-xs text-[#7A7163] hover:text-[#6E2A34] transition-colors underline underline-offset-2">
              {vi ? 'Xoá tất cả' : '전체 삭제'}
            </button>
          </div>

          {/* Delivery info strip */}
          <div className={`mt-5 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${isFreeShip ? 'bg-[#EBF4EB] text-[#3A6B3A] border border-[#C0DFC0]' : 'bg-[#FBF6EF] text-[#7A7163] border border-[#E4D9C8]'}`}>
            <span className="text-base">{isFreeShip ? '✅' : '🚚'}</span>
            {isFreeShip
              ? (vi ? 'Bạn được miễn phí giao hàng!' : '무료 배달 조건을 충족했습니다!')
              : (vi
                  ? `Thêm ${fmt(800000 - subtotal)}đ nữa để được miễn phí giao hàng`
                  : `무료 배달까지 ${fmt(800000 - subtotal)}₫ 남았습니다`
                )
            }
          </div>
        </div>

        {/* ── Right: Order summary ── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-[#E4D9C8] overflow-hidden sticky top-[136px]">
            {/* Header */}
            <div className="bg-[#6E2A34] px-5 py-4">
              <h2 className={`text-base font-bold text-white ${lang === 'ko' ? 'font-display-ko' : 'font-display-vi'}`}>
                {vi ? 'Tóm tắt đơn hàng' : '주문 요약'}
              </h2>
            </div>

            <div className="p-5 space-y-3">
              {/* Items list */}
              <div className="space-y-2.5 pb-3 border-b border-[#E4D9C8]">
                {cart.map(item => {
                  const name = lang === 'vi' ? item.product.nameVi : item.product.nameKo
                  return (
                    <div key={item.product.id} className="flex justify-between items-start gap-2 text-sm">
                      <span className="text-[#7A7163] leading-snug flex-1 line-clamp-2">
                        {name} <span className="text-[#2B2A26] font-medium">×{item.qty}</span>
                      </span>
                      <span className="font-semibold text-[#2B2A26] tabular-nums shrink-0">
                        {fmt(item.product.price * item.qty)}{tx.vnd}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Subtotal / VAT / Discount / Total */}
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#7A7163]">{vi ? 'Tổng phụ' : '소계'}</span>
                  <span className="font-medium text-[#2B2A26] tabular-nums">{fmt(subtotal)}{tx.vnd}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#7A7163]">VAT 8%</span>
                  <span className="font-medium text-[#2B2A26] tabular-nums">+{fmt(vat)}{tx.vnd}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#7A7163]">{vi ? 'Phí giao hàng' : '배달비'}</span>
                  <span className={`font-semibold tabular-nums ${isFreeShip ? 'text-[#3A6B3A]' : 'text-[#2B2A26]'}`}>
                    {isFreeShip ? (vi ? 'Miễn phí' : '무료') : `30.000${tx.vnd}`}
                  </span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5F6F52] flex items-center gap-1">
                      🏷 {vi ? 'Mã giảm giá 5%' : '쿠폰 5% 할인'}
                    </span>
                    <span className="font-semibold text-[#5F6F52] tabular-nums">-{fmt(discount)}{tx.vnd}</span>
                  </div>
                )}
              </div>

              {/* Coupon input */}
              <div className="pt-1 border-t border-[#E4D9C8]">
                <p className="text-xs font-semibold text-[#2B2A26] mb-2">{vi ? 'Mã khuyến mãi' : '쿠폰 코드'}</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={vi ? 'Nhập mã giảm giá...' : '코드 입력...'}
                    value={coupon}
                    onChange={e => setCoupon(e.target.value.toUpperCase())}
                    className="flex-1 text-xs border border-[#E4D9C8] rounded-lg px-3 py-2 focus:outline-none focus:border-[#6E2A34] transition-colors bg-[#FDFAF6] font-mono tracking-wide"
                  />
                  <button
                    onClick={() => { if (coupon.length > 2) { setCouponApplied(true) } }}
                    className="px-3 py-2 text-xs font-bold bg-[#2B2A26] text-white rounded-lg hover:bg-[#3D3C38] transition-colors whitespace-nowrap"
                  >
                    {vi ? 'Áp dụng' : '적용'}
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-xs text-[#5F6F52] mt-1.5 flex items-center gap-1">
                    ✓ {vi ? 'Mã áp dụng thành công!' : '쿠폰이 적용되었습니다!'}
                  </p>
                )}
              </div>

              {/* Grand total */}
              <div className="flex justify-between items-center pt-3 border-t-2 border-[#2B2A26]">
                <span className="font-bold text-[#2B2A26]">{vi ? 'Tổng cộng' : '총 합계'}</span>
                <span className={`text-xl font-bold text-[#6E2A34] tabular-nums ${lang === 'ko' ? 'font-display-ko' : 'font-display-vi'}`}>
                  {fmt(total + (isFreeShip ? 0 : 30000))}{tx.vnd}
                </span>
              </div>

              {/* CTA */}
              <button
                onClick={onCheckout}
                className="w-full py-4 bg-[#6E2A34] text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-[#5C2129] transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                {tx.cart.checkout} →
              </button>

              {/* Trust badges */}
              <div className="pt-2 grid grid-cols-3 gap-2 text-center">
                {[
                  { icon: '🔒', label: vi ? 'Thanh toán\nan toàn' : '안전\n결제' },
                  { icon: '↩️', label: vi ? 'Đổi trả\nmiễn phí' : '무료\n반품' },
                  { icon: '📞', label: vi ? 'Hỗ trợ\n24/7' : '24/7\n상담' },
                ].map(b => (
                  <div key={b.icon} className="flex flex-col items-center gap-1 p-2 rounded-lg bg-[#FBF6EF]">
                    <span className="text-lg">{b.icon}</span>
                    <span className="text-[9px] text-[#7A7163] font-medium leading-tight whitespace-pre-line text-center">{b.label}</span>
                  </div>
                ))}
              </div>

              {/* Payment methods */}
              <div className="flex items-center justify-center gap-2 pt-1">
                {['💳', '🏦', '📱', '💵'].map(m => (
                  <div key={m} className="w-8 h-6 flex items-center justify-center bg-[#F4EDE3] rounded border border-[#E4D9C8] text-sm">{m}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Checkout Page ────────────────────────────────────────────────────────────
function CheckoutPage({ lang, cart, onDone }: { lang: Lang; cart: CartItem[]; onDone: () => void }) {
  const tx = T[lang]
  const [form, setForm] = useState({ name: '', phone: '', address: '', delivery: '', time: '08:00–12:00', message: '', payment: 0 })
  const [done, setDone] = useState(false)
  const total = cart.reduce((s, i) => s + i.product.price * i.qty, 0)
  const times = ['08:00–12:00', '12:00–17:00', '17:00–21:00']

  if (done) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-6">🌸</div>
        <h2 className={`text-3xl text-[#6E2A34] mb-3 ${lang === 'ko' ? 'font-display-ko' : 'font-display-vi'}`}>{tx.checkout.success}</h2>
        <p className="text-[#7A7163] mb-8 leading-relaxed">{tx.checkout.successMsg}</p>
        <button onClick={onDone} className="px-8 py-3 bg-[#6E2A34] text-white rounded-full font-semibold hover:bg-[#5C2129] transition-colors">
          {tx.backHome}
        </button>
      </div>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className={`text-4xl text-[#2B2A26] mb-8 ${lang === 'ko' ? 'font-display-ko' : 'font-display-vi'}`}>{tx.checkout.title}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-4">
          {([
            { key: 'name' as const, label: tx.checkout.name, type: 'text' },
            { key: 'phone' as const, label: tx.checkout.phone, type: 'tel' },
            { key: 'address' as const, label: tx.checkout.address, type: 'text' },
            { key: 'delivery' as const, label: tx.checkout.delivery, type: 'date' },
          ]).map(f => (
            <div key={f.key}>
              <label className="text-xs font-semibold text-[#7A7163] uppercase tracking-widest">{f.label}</label>
              <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="mt-1.5 w-full border border-[#E4D9C8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6E2A34] bg-white transition-colors" />
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold text-[#7A7163] uppercase tracking-widest">{tx.checkout.time}</label>
            <div className="flex gap-2 mt-1.5">
              {times.map(time => (
                <button key={time} onClick={() => setForm(p => ({ ...p, time }))}
                  className={`flex-1 py-2.5 text-xs rounded-xl border transition-colors ${form.time === time ? 'bg-[#6E2A34] text-white border-[#6E2A34]' : 'border-[#E4D9C8] text-[#2B2A26] hover:border-[#6E2A34]'}`}>
                  {time}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#7A7163] uppercase tracking-widest">{tx.checkout.message}</label>
            <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={3}
              className="mt-1.5 w-full border border-[#E4D9C8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6E2A34] bg-white resize-none transition-colors" />
            <p className="text-xs text-[#7A7163] mt-1">{tx.checkout.messageHint}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#7A7163] uppercase tracking-widest mb-2 block">{tx.checkout.payment}</label>
            <div className="space-y-2">
              {tx.checkout.payOptions.map((opt, i) => (
                <label key={i} className="flex items-center gap-3 p-3 border border-[#E4D9C8] rounded-xl cursor-pointer hover:border-[#6E2A34] bg-white transition-colors">
                  <input type="radio" name="pay" checked={form.payment === i} onChange={() => setForm(p => ({ ...p, payment: i }))} className="accent-[#6E2A34]" />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-[#E4D9C8] p-5 sticky top-[132px]">
            <h3 className="font-semibold text-[#2B2A26] mb-4">{tx.orderSummary}</h3>
            <div className="space-y-3 mb-4">
              {cart.map(item => (
                <div key={item.product.id} className="flex justify-between text-sm gap-2">
                  <span className="text-[#7A7163] flex-1 leading-snug">
                    {lang === 'vi' ? item.product.nameVi : item.product.nameKo} ×{item.qty}
                  </span>
                  <span className="font-medium whitespace-nowrap tabular-nums shrink-0">{fmt(item.product.price * item.qty)}{T[lang].vnd}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#E4D9C8] pt-3 flex justify-between items-center">
              <span className="font-medium text-[#2B2A26]">{tx.cart.total}</span>
              <span className={`text-xl text-[#6E2A34] font-semibold tabular-nums ${lang === 'ko' ? 'font-display-ko' : 'font-display-vi'}`}>
                {fmt(total)}{T[lang].vnd}
              </span>
            </div>
            <button onClick={() => setDone(true)}
              className="mt-4 w-full py-3.5 bg-[#6E2A34] text-white font-bold text-sm uppercase tracking-wide rounded-xl hover:bg-[#5C2129] transition-colors">
              {tx.checkout.confirm}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => {
    const id = setTimeout(onDone, 2400)
    return () => clearTimeout(id)
  }, [onDone])
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#2B2A26] text-white text-sm px-5 py-3 rounded-full shadow-xl flex items-center gap-2"
      style={{ animation: 'fadeInUp 0.3s ease' }}>
      <span>🌸</span> {msg}
    </div>
  )
}

// ─── Home Hero Grid (3-col: sidebar | carousel | promos) ─────────────────────
function HomeHeroGrid({ lang, onNav, onShopOcc }: { lang: Lang; onNav: (p: Page) => void; onShopOcc: (k: OccasionKey | 'sale') => void }) {
  const vi = lang === 'vi'
  const promos = [
    {
      label: vi ? 'Hoa Sinh Nhật' : '생일 꽃',
      sub: vi ? 'Giao trong ngày' : '당일 배달',
      color: 'from-[#D9A6A0] to-[#C07E78]',
      img: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=320&q=80',
      key: 'birthday' as OccasionKey,
    },
    {
      label: vi ? 'Hoa Khai Trương' : '개업 꽃',
      sub: vi ? 'Kệ hoa lớn' : '대형 화환',
      color: 'from-[#5F6F52] to-[#3D4D33]',
      img: 'https://images.unsplash.com/photo-1487530811015-780f336b74a1?w=320&q=80',
      key: 'opening' as OccasionKey,
    },
    {
      label: vi ? 'SALE -30%' : '세일 -30%',
      sub: vi ? 'Hoa đặc biệt' : '특별 할인',
      color: 'from-[#6E2A34] to-[#4A1A22]',
      img: 'https://images.unsplash.com/photo-1490750967868-88df5691cc8f?w=320&q=80',
      key: 'sale' as OccasionKey | 'sale',
    },
    {
      label: vi ? 'Hoa Cưới Hỏi' : '결혼 꽃',
      sub: vi ? 'Sang trọng · Tinh tế' : '우아하고 세련된',
      color: 'from-[#E4D9C8] to-[#C9B9A2]',
      img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=320&q=80',
      key: 'wedding' as OccasionKey,
    },
  ]

  return (
    <div className="bg-[#F4EDE3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="grid grid-cols-1 gap-3">

          {/* Carousel + promo row */}
          <div className="flex flex-col gap-3">
            <div className="rounded-xl overflow-hidden">
              <HeroCarousel lang={lang} onNav={onNav} />
            </div>
            {/* 4 promo tiles horizontal */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {promos.map(p => (
                <button key={String(p.key)} onClick={() => onShopOcc(p.key as OccasionKey | 'sale')}
                  className="relative h-[100px] rounded-xl overflow-hidden group cursor-pointer">
                  <img src={p.img} alt={p.label} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${p.color} opacity-75 group-hover:opacity-65 transition-opacity`} />
                  <div className="absolute inset-0 p-3 flex flex-col justify-end">
                    <p className="text-white font-bold text-sm leading-tight drop-shadow">{p.label}</p>
                    <p className="text-white/80 text-[10px] mt-0.5 drop-shadow">{p.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage({ lang, onAddCart, onProductClick, onNav, onShopOcc }: {
  lang: Lang; onAddCart: (p: Product) => void; onProductClick: (p: Product) => void
  onNav: (p: Page) => void; onShopOcc: (k: OccasionKey | 'sale') => void
}) {
  const tx = T[lang]
  const saleProducts    = PRODUCTS.filter(p => !!p.originalPrice)
  const popularProducts = PRODUCTS.filter(p => p.isPopular)
  const newProducts     = PRODUCTS.filter(p => p.isNew)

  const commonProps = { lang, onAdd: onAddCart, onProductClick, onViewAll: () => onNav('shop') }

  return (
    <>
      <HomeHeroGrid lang={lang} onNav={onNav} onShopOcc={onShopOcc} />

      <ProductSection
        title={tx.sections.sale.title} sub={tx.sections.sale.sub}
        products={saleProducts} {...commonProps}
        bgClass="bg-[#FBF6EF]"
        onViewAll={() => onShopOcc('sale')}
      />

      <ProductSection
        title={tx.sections.popular.title} sub={tx.sections.popular.sub}
        products={popularProducts} {...commonProps}
        bgClass="bg-[#F4EDE3]"
      />

      <ProductSection
        title={tx.sections.newest.title} sub={tx.sections.newest.sub}
        products={newProducts} {...commonProps}
        bgClass="bg-[#FBF6EF]"
      />

      {/* Per-occasion sections */}
      {OCCASION_KEYS.map((k, i) => {
        const prods = PRODUCTS.filter(p => p.occasions.includes(k))
        return (
          <ProductSection
            key={k}
            title={OCC[k][lang]} sub={lang === 'vi' ? `— Dành cho dịp ${OCC[k].vi.toLowerCase()}` : `— ${OCC[k].ko} 선물`}
            products={prods} {...commonProps}
            bgClass={i % 2 === 0 ? 'bg-[#F4EDE3]' : 'bg-[#FBF6EF]'}
            onViewAll={() => onShopOcc(k)}
          />
        )
      })}

      <TrustSection lang={lang} />
      <Footer lang={lang} />
    </>
  )
}

// ─── Auth Modal ───────────────────────────────────────────────────────────────
function AuthModal({ lang, initMode, onClose }: {
  lang: Lang; initMode: 'login' | 'register'; onClose: () => void
}) {
  const vi = lang === 'vi'
  const [mode, setMode] = useState<'login' | 'register'>(initMode)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (mode === 'register' && form.password !== form.confirm) {
      setError(vi ? 'Mật khẩu xác nhận không khớp.' : '비밀번호가 일치하지 않습니다.')
      return
    }
    if (form.password.length < 6) {
      setError(vi ? 'Mật khẩu tối thiểu 6 ký tự.' : '비밀번호는 최소 6자 이상이어야 합니다.')
      return
    }
    setDone(true)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-[#6E2A34] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🌸</span>
            <div>
              <p className={`text-white font-bold text-lg leading-tight ${lang === 'ko' ? 'font-display-ko' : 'font-display-vi'}`}>
                {vi ? 'Hoa Tươi' : '플라워 베트남'}
              </p>
              <p className="text-white/60 text-[10px] tracking-widest uppercase">
                {mode === 'login' ? (vi ? 'Đăng nhập tài khoản' : '로그인') : (vi ? 'Tạo tài khoản mới' : '회원가입')}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[#E4D9C8]">
          {(['login', 'register'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setDone(false); setError('') }}
              className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${mode === m ? 'text-[#6E2A34]' : 'text-[#7A7163] hover:text-[#2B2A26]'}`}>
              {m === 'login' ? (vi ? 'Đăng nhập' : '로그인') : (vi ? 'Đăng ký' : '회원가입')}
              {mode === m && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6E2A34]" />}
            </button>
          ))}
        </div>

        <div className="p-6">
          {done ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FBF6EF] flex items-center justify-center text-3xl">
                {mode === 'login' ? '👋' : '🌸'}
              </div>
              <h3 className={`text-xl font-bold text-[#2B2A26] mb-2 ${lang === 'ko' ? 'font-display-ko' : 'font-display-vi'}`}>
                {mode === 'login'
                  ? (vi ? 'Đăng nhập thành công!' : '로그인 성공!')
                  : (vi ? 'Đăng ký thành công!' : '회원가입 완료!')}
              </h3>
              <p className="text-sm text-[#7A7163] mb-6">
                {mode === 'login'
                  ? (vi ? 'Chào mừng bạn trở lại 🌸' : '돌아오신 것을 환영합니다 🌸')
                  : (vi ? 'Cảm ơn bạn đã đăng ký. Chúc bạn mua sắm vui vẻ!' : '가입해 주셔서 감사합니다. 즐거운 쇼핑 되세요!')}
              </p>
              <button onClick={onClose}
                className="px-8 py-2.5 bg-[#6E2A34] text-white text-sm font-bold rounded-full hover:bg-[#5C2129] transition-colors">
                {vi ? 'Tiếp tục mua sắm' : '쇼핑 계속하기'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-[#2B2A26] mb-1.5">{vi ? 'Họ và tên' : '이름'}</label>
                  <input required value={form.name} onChange={set('name')} type="text"
                    placeholder={vi ? 'Nguyễn Văn A' : '홍길동'}
                    className="w-full px-4 py-2.5 border border-[#E4D9C8] rounded-xl text-sm focus:outline-none focus:border-[#6E2A34] transition-colors bg-[#FEFCFA]" />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#2B2A26] mb-1.5">Email</label>
                <input required value={form.email} onChange={set('email')} type="email"
                  placeholder="example@email.com"
                  className="w-full px-4 py-2.5 border border-[#E4D9C8] rounded-xl text-sm focus:outline-none focus:border-[#6E2A34] transition-colors bg-[#FEFCFA]" />
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-[#2B2A26] mb-1.5">{vi ? 'Số điện thoại' : '전화번호'}</label>
                  <input value={form.phone} onChange={set('phone')} type="tel"
                    placeholder="0901 234 567"
                    className="w-full px-4 py-2.5 border border-[#E4D9C8] rounded-xl text-sm focus:outline-none focus:border-[#6E2A34] transition-colors bg-[#FEFCFA]" />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#2B2A26] mb-1.5">{vi ? 'Mật khẩu' : '비밀번호'}</label>
                <input required value={form.password} onChange={set('password')} type="password"
                  placeholder={vi ? 'Tối thiểu 6 ký tự' : '최소 6자 이상'}
                  className="w-full px-4 py-2.5 border border-[#E4D9C8] rounded-xl text-sm focus:outline-none focus:border-[#6E2A34] transition-colors bg-[#FEFCFA]" />
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-[#2B2A26] mb-1.5">{vi ? 'Xác nhận mật khẩu' : '비밀번호 확인'}</label>
                  <input required value={form.confirm} onChange={set('confirm')} type="password"
                    placeholder={vi ? 'Nhập lại mật khẩu' : '비밀번호 재입력'}
                    className="w-full px-4 py-2.5 border border-[#E4D9C8] rounded-xl text-sm focus:outline-none focus:border-[#6E2A34] transition-colors bg-[#FEFCFA]" />
                </div>
              )}

              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
              )}

              {mode === 'login' && (
                <div className="flex justify-end">
                  <button type="button" className="text-xs text-[#6E2A34] hover:underline underline-offset-2">
                    {vi ? 'Quên mật khẩu?' : '비밀번호를 잊으셨나요?'}
                  </button>
                </div>
              )}

              <button type="submit"
                className="w-full py-3 bg-[#6E2A34] text-white text-sm font-bold rounded-xl hover:bg-[#5C2129] transition-colors">
                {mode === 'login' ? (vi ? 'Đăng nhập' : '로그인') : (vi ? 'Tạo tài khoản' : '가입하기')}
              </button>

              {/* Social login */}
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-[#E4D9C8]" />
                <span className="text-xs text-[#7A7163]">{vi ? 'hoặc' : '또는'}</span>
                <div className="flex-1 h-px bg-[#E4D9C8]" />
              </div>
              <button type="button"
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-[#E4D9C8] rounded-xl text-xs font-semibold text-[#2B2A26] hover:bg-[#F4EDE3] transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                {vi ? 'Đăng nhập bằng Google' : 'Google로 계속하기'}
              </button>

              <p className="text-center text-xs text-[#7A7163] pt-1">
                {mode === 'login'
                  ? (vi ? 'Chưa có tài khoản? ' : '계정이 없으신가요? ')
                  : (vi ? 'Đã có tài khoản? ' : '이미 계정이 있으신가요? ')
                }
                <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
                  className="text-[#6E2A34] font-semibold hover:underline underline-offset-2">
                  {mode === 'login' ? (vi ? 'Đăng ký ngay' : '회원가입') : (vi ? 'Đăng nhập' : '로그인')}
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState<Lang>('vi')
  const [page, setPage] = useState<Page>('home')
  const [shopFilter, setShopFilter] = useState<OccasionKey | 'sale' | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [detailProduct, setDetailProduct] = useState<Product | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null)

  const addToCart = (product: Product) => {
    setCart(prev => {
      const ex = prev.find(i => i.product.id === product.id)
      if (ex) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { product, qty: 1, note: '' }]
    })
    const name = lang === 'vi' ? product.nameVi : product.nameKo
    setToast(lang === 'vi' ? `Đã đặt hoa: ${name}` : `꽃 담기: ${name}`)
  }

  const goProduct = (p: Product) => {
    setDetailProduct(p)
    setPage('product')
  }

  const goShopOcc = (k: OccasionKey | 'sale') => {
    setShopFilter(k)
    setPage('shop')
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [page, detailProduct])

  return (
    <div className="min-h-screen bg-[#FBF6EF]">
      <SiteHeader
        lang={lang} setLang={setLang} cartCount={cartCount}
        page={page} onNav={setPage} onShopOcc={goShopOcc}
        onOpenAuth={setAuthModal}
      />

      {/* Header height: ~32px (announce) + ~64px (header) + ~40px (nav) = 136px */}
      <div className="pt-[132px]">
        {page === 'home' && (
          <HomePage lang={lang} onAddCart={addToCart} onProductClick={goProduct} onNav={setPage} onShopOcc={goShopOcc} />
        )}
        {page === 'shop' && (
          <>
            <ShopPage lang={lang} onAddCart={addToCart} onProductClick={goProduct} initOcc={shopFilter} onHome={() => setPage('home')} />
            <Footer lang={lang} />
          </>
        )}
        {page === 'product' && detailProduct && (
          <>
            <ProductDetailPage
              product={detailProduct}
              lang={lang}
              onAdd={addToCart}
              onNav={setPage}
              onProductClick={goProduct}
            />
            <Footer lang={lang} />
          </>
        )}
        {page === 'cart' && (
          <>
            <CartPage lang={lang} cart={cart} setCart={setCart} onCheckout={() => setPage('checkout')} onShop={() => setPage('shop')} />
            <Footer lang={lang} />
          </>
        )}
        {page === 'checkout' && (
          <CheckoutPage lang={lang} cart={cart} onDone={() => { setCart([]); setPage('home') }} />
        )}
      </div>

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      {authModal && <AuthModal lang={lang} initMode={authModal} onClose={() => setAuthModal(null)} />}
    </div>
  )
}
