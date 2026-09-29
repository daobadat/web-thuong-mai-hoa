export type OrderStatus = 'new' | 'confirmed' | 'preparing' | 'delivering' | 'done' | 'cancelled';

export interface Order {
  id: string;
  customer: string;
  phone: string;
  address: string;
  city: string;
  products: { name: string; qty: number; price: number }[];
  total: number;
  status: OrderStatus;
  payment: string;
  paymentStatus: 'paid' | 'unpaid';
  date: string;
  time: string;
  deliveryTime: string;
  note: string;
  message: string;
}

export interface AdminProduct {
  id: number;
  nameVi: string;
  nameKo: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  sold: number;
  img: string;
  badge?: string;
  active: boolean;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  city: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
  lang: 'vi' | 'ko';
}

export const ADMIN_ORDERS: Order[] = [
  { id: '#ORD-2841', customer: 'Kim Jiyeon', phone: '0901 234 111', address: '24 Xuân Thủy, Cầu Giấy', city: 'Hà Nội', products: [{ name: 'Bó Hoa Hồng Phấn Premium', qty: 1, price: 850000 }], total: 850000, status: 'delivering', payment: 'Chuyển khoản', paymentStatus: 'paid', date: '17/08/2026', time: '10:24', deliveryTime: '12:00–17:00', note: '', message: '생일 축하해요! 항상 행복하게' },
  { id: '#ORD-2840', customer: 'Park Sanghoon', phone: '0902 345 222', address: '18 Đặng Thai Mai, Tây Hồ', city: 'Hà Nội', products: [{ name: 'Kệ Hoa Khai Trương', qty: 1, price: 1800000 }], total: 1800000, status: 'confirmed', payment: 'Chuyển khoản', paymentStatus: 'paid', date: '17/08/2026', time: '09:55', deliveryTime: '08:00–12:00', note: 'Giao trước 11h', message: '개업을 진심으로 축하드립니다' },
  { id: '#ORD-2839', customer: 'Choi Minji', phone: '0903 456 333', address: '88 Lê Lợi, Q.1', city: 'TP.HCM', products: [{ name: 'Hộp Hoa Mix Pastel', qty: 2, price: 650000 }], total: 1300000, status: 'done', payment: 'Momo', paymentStatus: 'paid', date: '17/08/2026', time: '08:30', deliveryTime: '08:00–12:00', note: '', message: '감사합니다' },
  { id: '#ORD-2838', customer: 'Lee Donghyun', phone: '0904 567 444', address: '56 Nguyễn Văn Linh, Q.7', city: 'TP.HCM', products: [{ name: 'Hộp Quà Hoa Doanh Nghiệp', qty: 3, price: 1200000 }], total: 3600000, status: 'done', payment: 'Chuyển khoản', paymentStatus: 'paid', date: '16/08/2026', time: '15:20', deliveryTime: '17:00–21:00', note: 'In logo Samsung', message: '' },
  { id: '#ORD-2837', customer: 'Jung Yoonji', phone: '0905 678 555', address: '12 Hàng Bông, Hoàn Kiếm', city: 'Hà Nội', products: [{ name: 'Bó Hoa Trắng Tinh Khôi', qty: 1, price: 720000 }], total: 720000, status: 'cancelled', payment: 'Tiền mặt', paymentStatus: 'unpaid', date: '16/08/2026', time: '07:15', deliveryTime: '08:00–12:00', note: '', message: '' },
  { id: '#ORD-2836', customer: 'Kwon Jisoo', phone: '0906 789 666', address: '33 Trần Hưng Đạo, Q.1', city: 'TP.HCM', products: [{ name: 'Bó Hoa Hướng Dương', qty: 2, price: 450000 }, { name: 'Hộp Hoa Mix Pastel', qty: 1, price: 650000 }], total: 1550000, status: 'preparing', payment: 'ZaloPay', paymentStatus: 'paid', date: '17/08/2026', time: '11:00', deliveryTime: '17:00–21:00', note: '', message: '사랑해요 ♥' },
  { id: '#ORD-2835', customer: 'Han Seojun', phone: '0907 890 777', address: '7 Nguyễn Chí Thanh, Đống Đa', city: 'Hà Nội', products: [{ name: 'Kệ Hoa Mừng Sinh Nhật', qty: 1, price: 950000 }], total: 950000, status: 'new', payment: 'Momo', paymentStatus: 'unpaid', date: '17/08/2026', time: '11:45', deliveryTime: '17:00–21:00', note: 'Cần giao đúng giờ', message: '생일 축하합니다!' },
];

export const ADMIN_PRODUCTS: AdminProduct[] = [
  { id: 1, nameVi: 'Bó Hoa Hồng Phấn Premium', nameKo: '프리미엄 핑크 장미 꽃다발', category: 'Bó hoa', price: 850000, originalPrice: 1050000, stock: 12, sold: 48, img: 'https://images.unsplash.com/photo-1680563094046-5d846e2c59d1?w=200&h=200&fit=crop', badge: 'popular', active: true },
  { id: 2, nameVi: 'Hộp Hoa Mix Pastel', nameKo: '파스텔 믹스 꽃 박스', category: 'Hộp hoa', price: 650000, stock: 8, sold: 31, img: 'https://images.unsplash.com/photo-1644248423441-bc7c5dcebeb6?w=200&h=200&fit=crop', badge: 'new', active: true },
  { id: 3, nameVi: 'Kệ Hoa Khai Trương', nameKo: '개업 화환', category: 'Kệ hoa', price: 1800000, stock: 5, sold: 22, img: 'https://images.unsplash.com/photo-1760618511409-9d80f26e36f4?w=200&h=200&fit=crop', badge: 'popular', active: true },
  { id: 4, nameVi: 'Giỏ Hoa Cúc Vàng', nameKo: '노란 국화 꽃 바구니', category: 'Giỏ hoa', price: 520000, stock: 15, sold: 19, img: 'https://images.unsplash.com/photo-1689061732262-2f8a68fa99cb?w=200&h=200&fit=crop', active: true },
  { id: 5, nameVi: 'Bó Hoa Trắng Tinh Khôi', nameKo: '순백 웨딩 꽃다발', category: 'Bó hoa', price: 720000, stock: 6, sold: 27, img: 'https://images.unsplash.com/photo-1652346072098-cfc2e94d30e7?w=200&h=200&fit=crop', badge: 'new', active: true },
  { id: 6, nameVi: 'Hộp Quà Hoa Doanh Nghiệp', nameKo: '기업용 꽃 선물 세트', category: 'Hộp hoa', price: 1200000, originalPrice: 1500000, stock: 10, sold: 15, img: 'https://images.unsplash.com/photo-1667010723263-8ad9a8f5f6c6?w=200&h=200&fit=crop', badge: 'sale', active: true },
  { id: 7, nameVi: 'Bó Hoa Hướng Dương', nameKo: '해바라기 꽃다발', category: 'Bó hoa', price: 450000, stock: 20, sold: 36, img: 'https://images.unsplash.com/photo-1644248422980-8e0eb75a1557?w=200&h=200&fit=crop', active: true },
  { id: 8, nameVi: 'Kệ Hoa Mừng Sinh Nhật', nameKo: '생일 화환', category: 'Kệ hoa', price: 950000, stock: 4, sold: 11, img: 'https://images.unsplash.com/photo-1652346107876-58d7354ce9b8?w=200&h=200&fit=crop', badge: 'popular', active: false },
];

export const ADMIN_CUSTOMERS: Customer[] = [
  { id: 1, name: 'Kim Jiyeon', phone: '0901 234 111', email: 'jiyeon.kim@gmail.com', city: 'Hà Nội', orders: 7, totalSpent: 5250000, lastOrder: '17/08/2026', lang: 'ko' },
  { id: 2, name: 'Park Sanghoon', phone: '0902 345 222', email: 'sanghoon@naver.com', city: 'Hà Nội', orders: 4, totalSpent: 6800000, lastOrder: '17/08/2026', lang: 'ko' },
  { id: 3, name: 'Choi Minji', phone: '0903 456 333', email: 'minji.choi@kakao.com', city: 'TP.HCM', orders: 12, totalSpent: 9100000, lastOrder: '17/08/2026', lang: 'ko' },
  { id: 4, name: 'Lee Donghyun', phone: '0904 567 444', email: 'lee.donghyun@samsung.com', city: 'TP.HCM', orders: 3, totalSpent: 5400000, lastOrder: '16/08/2026', lang: 'ko' },
  { id: 5, name: 'Jung Yoonji', phone: '0905 678 555', email: 'yoonji.jung@gmail.com', city: 'Hà Nội', orders: 2, totalSpent: 1470000, lastOrder: '16/08/2026', lang: 'ko' },
  { id: 6, name: 'Trần Lan Anh', phone: '0912 111 222', email: 'lananh@gmail.com', city: 'Hà Nội', orders: 5, totalSpent: 3200000, lastOrder: '15/08/2026', lang: 'vi' },
  { id: 7, name: 'Kwon Jisoo', phone: '0906 789 666', email: 'jisoo.kwon@daum.net', city: 'TP.HCM', orders: 9, totalSpent: 7650000, lastOrder: '17/08/2026', lang: 'ko' },
];

export const STATUS_CONFIG: Record<OrderStatus, { label: string; cls: string; dot: string }> = {
  new: { label: 'Đơn mới', cls: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
  confirmed: { label: 'Đã xác nhận', cls: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  preparing: { label: 'Đang chuẩn bị', cls: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  delivering: { label: 'Đang giao', cls: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  done: { label: 'Hoàn thành', cls: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  cancelled: { label: 'Đã huỷ', cls: 'bg-red-100 text-red-600', dot: 'bg-red-500' },
};
