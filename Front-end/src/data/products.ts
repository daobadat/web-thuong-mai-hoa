import type { OccasionKey, Product } from '../types'

export const OCC: Record<OccasionKey, { vi: string; ko: string }> = {
  birthday:  { vi: 'Hoa Sinh Nhật',         ko: '생일 꽃' },
  opening:   { vi: 'Hoa Khai Trương',        ko: '개업 꽃' },
  wedding:   { vi: 'Hoa Cưới Hỏi',           ko: '결혼 꽃' },
  corporate: { vi: 'Quà Doanh Nghiệp',       ko: '기업 선물' },
  chuseok:   { vi: 'Chuseok 추석',            ko: '추석 꽃' },
  valentine: { vi: 'Valentine · 화이트데이',  ko: '화이트데이' },
}

export const OCCASION_KEYS: OccasionKey[] = ['birthday', 'opening', 'wedding', 'corporate', 'chuseok', 'valentine']

export const OCC_ICONS: Record<OccasionKey, string> = {
  birthday:  '🎂',
  opening:   '🎋',
  wedding:   '💍',
  corporate: '💼',
  chuseok:   '🍂',
  valentine: '💝',
}

export const PRODUCTS: Product[] = [
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

export const OCC_INFO: Record<OccasionKey | 'sale', {
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
