import { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
type AdminPage = 'dashboard' | 'orders' | 'products' | 'customers' | 'analytics' | 'settings'
type OrderStatus = 'new' | 'confirmed' | 'preparing' | 'delivering' | 'done' | 'cancelled'

interface Order {
  id: string
  customer: string
  phone: string
  address: string
  city: string
  products: { name: string; qty: number; price: number }[]
  total: number
  status: OrderStatus
  payment: string
  paymentStatus: 'paid' | 'unpaid'
  date: string
  time: string
  deliveryTime: string
  note: string
  message: string
}

interface Product {
  id: number
  nameVi: string
  nameKo: string
  category: string
  price: number
  originalPrice?: number
  stock: number
  sold: number
  img: string
  badge?: string
  active: boolean
}

interface Customer {
  id: number
  name: string
  phone: string
  email: string
  city: string
  orders: number
  totalSpent: number
  lastOrder: string
  lang: 'vi' | 'ko'
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const ORDERS: Order[] = [
  { id: '#ORD-2841', customer: 'Kim Jiyeon', phone: '0901 234 111', address: '24 Xuân Thủy, Cầu Giấy', city: 'Hà Nội', products: [{ name: 'Bó Hoa Hồng Phấn Premium', qty: 1, price: 850000 }], total: 850000, status: 'delivering', payment: 'Chuyển khoản', paymentStatus: 'paid', date: '17/08/2026', time: '10:24', deliveryTime: '12:00–17:00', note: '', message: '생일 축하해요! 항상 행복하게' },
  { id: '#ORD-2840', customer: 'Park Sanghoon', phone: '0902 345 222', address: '18 Đặng Thai Mai, Tây Hồ', city: 'Hà Nội', products: [{ name: 'Kệ Hoa Khai Trương', qty: 1, price: 1800000 }], total: 1800000, status: 'confirmed', payment: 'Chuyển khoản', paymentStatus: 'paid', date: '17/08/2026', time: '09:55', deliveryTime: '08:00–12:00', note: 'Giao trước 11h', message: '개업을 진심으로 축하드립니다' },
  { id: '#ORD-2839', customer: 'Choi Minji', phone: '0903 456 333', address: '88 Lê Lợi, Q.1', city: 'TP.HCM', products: [{ name: 'Hộp Hoa Mix Pastel', qty: 2, price: 650000 }], total: 1300000, status: 'done', payment: 'Momo', paymentStatus: 'paid', date: '17/08/2026', time: '08:30', deliveryTime: '08:00–12:00', note: '', message: '감사합니다' },
  { id: '#ORD-2838', customer: 'Lee Donghyun', phone: '0904 567 444', address: '56 Nguyễn Văn Linh, Q.7', city: 'TP.HCM', products: [{ name: 'Hộp Quà Hoa Doanh Nghiệp', qty: 3, price: 1200000 }], total: 3600000, status: 'done', payment: 'Chuyển khoản', paymentStatus: 'paid', date: '16/08/2026', time: '15:20', deliveryTime: '17:00–21:00', note: 'In logo Samsung', message: '' },
  { id: '#ORD-2837', customer: 'Jung Yoonji', phone: '0905 678 555', address: '12 Hàng Bông, Hoàn Kiếm', city: 'Hà Nội', products: [{ name: 'Bó Hoa Trắng Tinh Khôi', qty: 1, price: 720000 }], total: 720000, status: 'cancelled', payment: 'Tiền mặt', paymentStatus: 'unpaid', date: '16/08/2026', time: '07:15', deliveryTime: '08:00–12:00', note: '', message: '' },
  { id: '#ORD-2836', customer: 'Kwon Jisoo', phone: '0906 789 666', address: '33 Trần Hưng Đạo, Q.1', city: 'TP.HCM', products: [{ name: 'Bó Hoa Hướng Dương', qty: 2, price: 450000 }, { name: 'Hộp Hoa Mix Pastel', qty: 1, price: 650000 }], total: 1550000, status: 'preparing', payment: 'ZaloPay', paymentStatus: 'paid', date: '17/08/2026', time: '11:00', deliveryTime: '17:00–21:00', note: '', message: '사랑해요 ♥' },
  { id: '#ORD-2835', customer: 'Han Seojun', phone: '0907 890 777', address: '7 Nguyễn Chí Thanh, Đống Đa', city: 'Hà Nội', products: [{ name: 'Kệ Hoa Mừng Sinh Nhật', qty: 1, price: 950000 }], total: 950000, status: 'new', payment: 'Momo', paymentStatus: 'unpaid', date: '17/08/2026', time: '11:45', deliveryTime: '17:00–21:00', note: 'Cần giao đúng giờ', message: '생일 축하합니다!' },
]

const PRODUCTS: Product[] = [
  { id: 1, nameVi: 'Bó Hoa Hồng Phấn Premium', nameKo: '프리미엄 핑크 장미 꽃다발', category: 'Bó hoa', price: 850000, originalPrice: 1050000, stock: 12, sold: 48, img: 'https://images.unsplash.com/photo-1680563094046-5d846e2c59d1?w=200&h=200&fit=crop', badge: 'popular', active: true },
  { id: 2, nameVi: 'Hộp Hoa Mix Pastel', nameKo: '파스텔 믹스 꽃 박스', category: 'Hộp hoa', price: 650000, stock: 8, sold: 31, img: 'https://images.unsplash.com/photo-1644248423441-bc7c5dcebeb6?w=200&h=200&fit=crop', badge: 'new', active: true },
  { id: 3, nameVi: 'Kệ Hoa Khai Trương', nameKo: '개업 화환', category: 'Kệ hoa', price: 1800000, stock: 5, sold: 22, img: 'https://images.unsplash.com/photo-1760618511409-9d80f26e36f4?w=200&h=200&fit=crop', badge: 'popular', active: true },
  { id: 4, nameVi: 'Giỏ Hoa Cúc Vàng', nameKo: '노란 국화 꽃 바구니', category: 'Giỏ hoa', price: 520000, stock: 15, sold: 19, img: 'https://images.unsplash.com/photo-1689061732262-2f8a68fa99cb?w=200&h=200&fit=crop', active: true },
  { id: 5, nameVi: 'Bó Hoa Trắng Tinh Khôi', nameKo: '순백 웨딩 꽃다발', category: 'Bó hoa', price: 720000, stock: 6, sold: 27, img: 'https://images.unsplash.com/photo-1652346072098-cfc2e94d30e7?w=200&h=200&fit=crop', badge: 'new', active: true },
  { id: 6, nameVi: 'Hộp Quà Hoa Doanh Nghiệp', nameKo: '기업용 꽃 선물 세트', category: 'Hộp hoa', price: 1200000, originalPrice: 1500000, stock: 10, sold: 15, img: 'https://images.unsplash.com/photo-1667010723263-8ad9a8f5f6c6?w=200&h=200&fit=crop', badge: 'sale', active: true },
  { id: 7, nameVi: 'Bó Hoa Hướng Dương', nameKo: '해바라기 꽃다발', category: 'Bó hoa', price: 450000, stock: 20, sold: 36, img: 'https://images.unsplash.com/photo-1644248422980-8e0eb75a1557?w=200&h=200&fit=crop', active: true },
  { id: 8, nameVi: 'Kệ Hoa Mừng Sinh Nhật', nameKo: '생일 화환', category: 'Kệ hoa', price: 950000, stock: 4, sold: 11, img: 'https://images.unsplash.com/photo-1652346107876-58d7354ce9b8?w=200&h=200&fit=crop', badge: 'popular', active: false },
]

const CUSTOMERS: Customer[] = [
  { id: 1, name: 'Kim Jiyeon', phone: '0901 234 111', email: 'jiyeon.kim@gmail.com', city: 'Hà Nội', orders: 7, totalSpent: 5250000, lastOrder: '17/08/2026', lang: 'ko' },
  { id: 2, name: 'Park Sanghoon', phone: '0902 345 222', email: 'sanghoon@naver.com', city: 'Hà Nội', orders: 4, totalSpent: 6800000, lastOrder: '17/08/2026', lang: 'ko' },
  { id: 3, name: 'Choi Minji', phone: '0903 456 333', email: 'minji.choi@kakao.com', city: 'TP.HCM', orders: 12, totalSpent: 9100000, lastOrder: '17/08/2026', lang: 'ko' },
  { id: 4, name: 'Lee Donghyun', phone: '0904 567 444', email: 'lee.donghyun@samsung.com', city: 'TP.HCM', orders: 3, totalSpent: 5400000, lastOrder: '16/08/2026', lang: 'ko' },
  { id: 5, name: 'Jung Yoonji', phone: '0905 678 555', email: 'yoonji.jung@gmail.com', city: 'Hà Nội', orders: 2, totalSpent: 1470000, lastOrder: '16/08/2026', lang: 'ko' },
  { id: 6, name: 'Trần Lan Anh', phone: '0912 111 222', email: 'lananh@gmail.com', city: 'Hà Nội', orders: 5, totalSpent: 3200000, lastOrder: '15/08/2026', lang: 'vi' },
  { id: 7, name: 'Kwon Jisoo', phone: '0906 789 666', email: 'jisoo.kwon@daum.net', city: 'TP.HCM', orders: 9, totalSpent: 7650000, lastOrder: '17/08/2026', lang: 'ko' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n)

const STATUS_CONFIG: Record<OrderStatus, { label: string; cls: string; dot: string }> = {
  new: { label: 'Đơn mới', cls: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
  confirmed: { label: 'Đã xác nhận', cls: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  preparing: { label: 'Đang chuẩn bị', cls: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  delivering: { label: 'Đang giao', cls: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  done: { label: 'Hoàn thành', cls: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  cancelled: { label: 'Đã huỷ', cls: 'bg-red-100 text-red-600', dot: 'bg-red-500' },
}

function StatusChip({ status }: { status: OrderStatus }) {
  const s = STATUS_CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV_ITEMS: { id: AdminPage; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Tổng quan', icon: '◉' },
  { id: 'orders', label: 'Đơn hàng', icon: '📦' },
  { id: 'products', label: 'Sản phẩm', icon: '🌸' },
  { id: 'customers', label: 'Khách hàng', icon: '👤' },
  { id: 'analytics', label: 'Thống kê', icon: '📊' },
  { id: 'settings', label: 'Cài đặt', icon: '⚙️' },
]

function Sidebar({ page, setPage, collapsed, setCollapsed }: {
  page: AdminPage; setPage: (p: AdminPage) => void
  collapsed: boolean; setCollapsed: (v: boolean) => void
}) {
  return (
    <aside className={`flex flex-col bg-[#2C1A2E] text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'} min-h-screen flex-shrink-0`}>
      <div className={`flex items-center gap-2 px-4 py-5 border-b border-white/10 ${collapsed ? 'justify-center' : ''}`}>
        <span className="text-2xl flex-shrink-0">🌸</span>
        {!collapsed && (
          <div>
            <div className="font-serif text-base text-white leading-tight">Hoa Tươi</div>
            <div className="text-[10px] text-white/50">Admin Panel</div>
          </div>
        )}
      </div>
      <nav className="flex-1 py-4 space-y-1 px-2">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${page === item.id ? 'bg-[#8B4A5C] text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'} ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            <span className="text-base flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors text-sm ${collapsed ? 'justify-center' : ''}`}
        >
          <span>{collapsed ? '→' : '←'}</span>
          {!collapsed && <span>Thu gọn</span>}
        </button>
        <a
          href="/"
          className={`mt-1 w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors text-sm ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Về trang bán hàng' : undefined}
        >
          <span>🛒</span>
          {!collapsed && <span>Trang bán hàng</span>}
        </a>
      </div>
    </aside>
  )
}

// ─── Dashboard (Operations cockpit — real-time, action-focused) ─────────────────
function Dashboard({ setPage }: { setPage: (p: AdminPage) => void }) {
  const todayOrders = ORDERS.filter(o => o.date === '17/08/2026')
  const todayRevenue = todayOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)
  const newOrders = ORDERS.filter(o => o.status === 'new')
  const deliveringOrders = ORDERS.filter(o => o.status === 'delivering')
  const unpaidOrders = ORDERS.filter(o => o.paymentStatus === 'unpaid' && o.status !== 'cancelled')
  const lowStock = PRODUCTS.filter(p => p.stock <= 5)

  // Action queue — things that need a decision right now
  const actionQueue = [
    { label: 'Đơn mới chờ xác nhận', count: newOrders.length, icon: '🆕', cls: 'bg-purple-50 text-purple-700 border-purple-100' },
    { label: 'Đơn đang trên đường giao', count: deliveringOrders.length, icon: '🚚', cls: 'bg-orange-50 text-orange-700 border-orange-100' },
    { label: 'Đơn chưa thanh toán', count: unpaidOrders.length, icon: '💳', cls: 'bg-red-50 text-red-600 border-red-100' },
    { label: 'Sản phẩm sắp hết hàng', count: lowStock.length, icon: '⚠️', cls: 'bg-amber-50 text-amber-700 border-amber-100' },
  ]

  // Today's delivery schedule grouped by time slot
  const SLOTS = ['08:00–12:00', '12:00–17:00', '17:00–21:00']
  const schedule = SLOTS.map(slot => ({
    slot,
    orders: todayOrders.filter(o => o.deliveryTime === slot && o.status !== 'cancelled'),
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-[#2C1A2E]">Tổng quan</h1>
          <p className="text-sm text-[#7A6870] mt-1">Trung tâm điều hành · Thứ Hai, 17 tháng 8 năm 2026</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-100">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Cập nhật thời gian thực
        </span>
      </div>

      {/* Today snapshot */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Doanh thu hôm nay', value: `${fmt(todayRevenue)}đ`, sub: `${todayOrders.length} đơn trong ngày`, icon: '💰' },
          { label: 'Đơn cần giao hôm nay', value: String(todayOrders.filter(o => o.status !== 'cancelled' && o.status !== 'done').length), sub: 'Đang trong quy trình', icon: '📋' },
          { label: 'Đã hoàn thành hôm nay', value: String(todayOrders.filter(o => o.status === 'done').length), sub: 'Giao thành công', icon: '✅' },
        ].map(k => (
          <div key={k.label} className="rounded-2xl p-5 bg-[#8B4A5C] text-white">
            <div className="flex justify-between items-start">
              <div className="text-xs font-medium opacity-70 mb-1">{k.label}</div>
              <span className="text-xl">{k.icon}</span>
            </div>
            <div className="font-serif text-3xl leading-none mt-1">{k.value}</div>
            <div className="text-xs opacity-60 mt-1">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Action queue — the operational heart of the dashboard */}
      <div className="bg-white rounded-2xl border border-[#EDE5DF] p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-[#2C1A2E]">Việc cần xử lý ngay</h3>
          <button onClick={() => setPage('orders')} className="text-xs text-[#8B4A5C] hover:underline">Tới đơn hàng →</button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {actionQueue.map(a => (
            <button
              key={a.label}
              onClick={() => setPage(a.label.includes('hàng') ? 'products' : 'orders')}
              className={`text-left rounded-xl p-4 border transition-transform hover:-translate-y-0.5 ${a.cls}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">{a.icon}</span>
                <span className="font-serif text-2xl leading-none">{a.count}</span>
              </div>
              <div className="text-xs font-medium mt-2 leading-snug">{a.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Today delivery schedule by time slot */}
      <div className="bg-white rounded-2xl border border-[#EDE5DF] p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-[#2C1A2E]">🕐 Lịch giao hàng hôm nay</h3>
          <span className="text-xs text-[#7A6870]">{todayOrders.filter(o => o.status !== 'cancelled').length} đơn theo khung giờ</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {schedule.map(s => (
            <div key={s.slot} className="rounded-xl border border-[#EDE5DF] bg-[#FAF7F2] p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#2C1A2E]">{s.slot}</span>
                <span className="text-xs font-semibold text-[#8B4A5C] bg-white rounded-full px-2 py-0.5 border border-[#EDE5DF]">{s.orders.length} đơn</span>
              </div>
              <div className="space-y-2">
                {s.orders.length === 0 ? (
                  <p className="text-xs text-[#7A6870] py-2 text-center">Chưa có đơn</p>
                ) : s.orders.map(o => (
                  <button key={o.id} onClick={() => setPage('orders')}
                    className="w-full flex items-center justify-between gap-2 bg-white rounded-lg px-2.5 py-2 border border-[#EDE5DF] hover:border-[#8B4A5C] transition-colors text-left">
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-[#2C1A2E] truncate">{o.customer}</div>
                      <div className="text-[10px] text-[#7A6870]">{o.city}</div>
                    </div>
                    <StatusChip status={o.status} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-white rounded-2xl border border-[#EDE5DF] p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-[#2C1A2E]">Đơn hàng gần đây</h3>
            <button onClick={() => setPage('orders')} className="text-xs text-[#8B4A5C] hover:underline">Xem tất cả →</button>
          </div>
          <div className="space-y-3">
            {ORDERS.slice(0, 5).map(o => (
              <div key={o.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F3ECE7] flex items-center justify-center text-sm font-serif text-[#8B4A5C]">
                    {o.customer[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#2C1A2E]">{o.customer}</div>
                    <div className="text-xs text-[#7A6870]">{o.id} · {o.time}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-[#2C1A2E]">{fmt(o.total)}đ</div>
                  <StatusChip status={o.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock alert */}
        <div className="bg-white rounded-2xl border border-[#EDE5DF] p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-[#2C1A2E]">⚠️ Cảnh báo tồn kho</h3>
            <button onClick={() => setPage('products')} className="text-xs text-[#8B4A5C] hover:underline">Quản lý →</button>
          </div>
          <div className="space-y-3">
            {lowStock.map(p => (
              <div key={p.id} className="flex items-center gap-3">
                <img src={p.img} alt={p.nameVi} className="w-10 h-10 rounded-lg object-cover bg-[#F3ECE7]" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-[#2C1A2E] line-clamp-1">{p.nameVi}</div>
                  <div className="text-xs text-[#7A6870]">{p.category}</div>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-700'}`}>
                  {p.stock === 0 ? 'Hết hàng' : `Còn ${p.stock}`}
                </span>
              </div>
            ))}
            {lowStock.length === 0 && <p className="text-sm text-[#7A6870] py-4 text-center">Tất cả sản phẩm còn hàng ✓</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Orders Page ──────────────────────────────────────────────────────────────
function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(ORDERS)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Order | null>(null)

  const filtered = orders.filter(o => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    const q = search.toLowerCase()
    return matchStatus && (!q || o.customer.toLowerCase().includes(q) || o.id.toLowerCase().includes(q))
  })

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
  }

  const STATUS_FLOW: Record<OrderStatus, OrderStatus | null> = {
    new: 'confirmed', confirmed: 'preparing', preparing: 'delivering', delivering: 'done', done: null, cancelled: null,
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-[#2C1A2E]">Đơn hàng</h1>
          <p className="text-sm text-[#7A6870] mt-0.5">{orders.length} đơn hàng · 17/08/2026</p>
        </div>
        <div className="relative max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A6870]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Tìm tên, mã đơn..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 w-full bg-white border border-[#DDD4CC] rounded-xl text-sm focus:outline-none focus:border-[#8B4A5C]" />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['all', 'new', 'confirmed', 'preparing', 'delivering', 'done', 'cancelled'] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 text-xs rounded-full border transition-colors font-medium ${statusFilter === s ? 'bg-[#2C1A2E] text-white border-[#2C1A2E]' : 'border-[#DDD4CC] text-[#7A6870] hover:border-[#8B4A5C]'}`}>
            {s === 'all' ? `Tất cả (${orders.length})` : STATUS_CONFIG[s].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#EDE5DF] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F3ECE7]">
                <tr>
                  {['Mã đơn', 'Khách hàng', 'Sản phẩm', 'Tổng tiền', 'Thanh toán', 'Trạng thái', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#7A6870] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE5DF]">
                {filtered.map(o => (
                  <tr key={o.id}
                    onClick={() => setSelected(o)}
                    className={`hover:bg-[#FAF7F2] cursor-pointer transition-colors ${selected?.id === o.id ? 'bg-[#FAF7F2]' : ''}`}>
                    <td className="px-4 py-3 font-mono text-xs text-[#8B4A5C] font-semibold">{o.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium whitespace-nowrap">{o.customer}</div>
                      <div className="text-xs text-[#7A6870]">{o.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-[#7A6870] text-xs max-w-[160px] truncate">{o.products.map(p => p.name).join(', ')}</td>
                    <td className="px-4 py-3 font-medium whitespace-nowrap">{fmt(o.total)}đ</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${o.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {o.paymentStatus === 'paid' ? 'Đã TT' : 'Chưa TT'}
                      </span>
                    </td>
                    <td className="px-4 py-3"><StatusChip status={o.status} /></td>
                    <td className="px-4 py-3">
                      {STATUS_FLOW[o.status] && (
                        <button
                          onClick={e => { e.stopPropagation(); updateStatus(o.id, STATUS_FLOW[o.status]!) }}
                          className="text-xs px-2.5 py-1 bg-[#8B4A5C] text-white rounded-lg hover:bg-[#7A3D4F] whitespace-nowrap"
                        >
                          Tiếp →
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selected ? (
          <div className="bg-white rounded-2xl border border-[#EDE5DF] p-5 space-y-4 h-fit sticky top-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-mono text-sm text-[#8B4A5C] font-bold">{selected.id}</div>
                <div className="font-medium text-[#2C1A2E] mt-0.5">{selected.customer}</div>
              </div>
              <button onClick={() => setSelected(null)} className="text-[#7A6870] hover:text-[#2C1A2E] text-xl">×</button>
            </div>
            <StatusChip status={selected.status} />
            <div className="space-y-2 text-sm">
              {[
                { label: '📞 SĐT', value: selected.phone },
                { label: '📍 Địa chỉ', value: `${selected.address}, ${selected.city}` },
                { label: '📅 Ngày', value: `${selected.date} · ${selected.time}` },
                { label: '🕐 Khung giờ', value: selected.deliveryTime },
                { label: '💳 Thanh toán', value: selected.payment },
              ].map(r => (
                <div key={r.label} className="flex gap-2">
                  <span className="text-[#7A6870] flex-shrink-0 w-28">{r.label}</span>
                  <span className="text-[#2C1A2E] font-medium">{r.value}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#EDE5DF] pt-3">
              <div className="text-xs text-[#7A6870] mb-2">Sản phẩm</div>
              {selected.products.map(p => (
                <div key={p.name} className="flex justify-between text-sm mb-1">
                  <span className="text-[#2C1A2E]">{p.name} ×{p.qty}</span>
                  <span className="font-medium">{fmt(p.price * p.qty)}đ</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold text-[#2C1A2E] border-t border-[#EDE5DF] pt-2 mt-2">
                <span>Tổng cộng</span>
                <span className="text-[#8B4A5C] font-serif">{fmt(selected.total)}đ</span>
              </div>
            </div>
            {selected.message && (
              <div className="bg-[#FAF7F2] rounded-xl p-3 text-sm italic text-[#7A6870] border border-[#EDE5DF]">
                💌 "{selected.message}"
              </div>
            )}
            {selected.note && (
              <div className="text-xs text-orange-700 bg-orange-50 rounded-xl p-3">⚠️ {selected.note}</div>
            )}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {STATUS_FLOW[selected.status] && (
                <button
                  onClick={() => updateStatus(selected.id, STATUS_FLOW[selected.status]!)}
                  className="py-2 bg-[#8B4A5C] text-white text-sm rounded-xl hover:bg-[#7A3D4F] transition-colors"
                >
                  Tiến trình →
                </button>
              )}
              {selected.status !== 'cancelled' && selected.status !== 'done' && (
                <button
                  onClick={() => updateStatus(selected.id, 'cancelled')}
                  className="py-2 border border-red-200 text-red-600 text-sm rounded-xl hover:bg-red-50 transition-colors"
                >
                  Huỷ đơn
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#EDE5DF] p-5 flex items-center justify-center text-[#7A6870] text-sm h-40">
            Chọn đơn hàng để xem chi tiết
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Products Page ─────────────────────────────────────────────────────────────
function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS)
  const [editId, setEditId] = useState<number | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newProd, setNewProd] = useState({ nameVi: '', nameKo: '', category: 'Bó hoa', price: '', stock: '', img: '' })

  const toggleActive = (id: number) =>
    setProducts(p => p.map(x => x.id === id ? { ...x, active: !x.active } : x))

  const saveEdit = (id: number, field: string, value: string | number) =>
    setProducts(p => p.map(x => x.id === id ? { ...x, [field]: value } : x))

  const addProduct = () => {
    if (!newProd.nameVi || !newProd.price) return
    const id = Math.max(...products.map(p => p.id)) + 1
    setProducts(prev => [...prev, {
      id, nameVi: newProd.nameVi, nameKo: newProd.nameKo,
      category: newProd.category, price: Number(newProd.price),
      stock: Number(newProd.stock), sold: 0,
      img: newProd.img || 'https://images.unsplash.com/photo-1680563094046-5d846e2c59d1?w=200&h=200&fit=crop',
      active: true,
    }])
    setShowAdd(false)
    setNewProd({ nameVi: '', nameKo: '', category: 'Bó hoa', price: '', stock: '', img: '' })
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl text-[#2C1A2E]">Sản phẩm</h1>
          <p className="text-sm text-[#7A6870] mt-0.5">{products.length} sản phẩm · {products.filter(p => p.active).length} đang bán</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#8B4A5C] text-white text-sm font-medium rounded-xl hover:bg-[#7A3D4F] transition-colors">
          <span>+</span> Thêm sản phẩm
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl border border-[#EDE5DF] p-5">
          <h3 className="font-medium text-[#2C1A2E] mb-4">Thêm sản phẩm mới</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: 'nameVi', label: 'Tên (tiếng Việt)', type: 'text' },
              { key: 'nameKo', label: 'Tên (tiếng Hàn)', type: 'text' },
              { key: 'price', label: 'Giá (VND)', type: 'number' },
              { key: 'stock', label: 'Tồn kho', type: 'number' },
              { key: 'img', label: 'URL ảnh', type: 'text' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-medium text-[#7A6870] uppercase tracking-wide">{f.label}</label>
                <input type={f.type} value={newProd[f.key as keyof typeof newProd]}
                  onChange={e => setNewProd(p => ({ ...p, [f.key]: e.target.value }))}
                  className="mt-1 w-full border border-[#DDD4CC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4A5C]" />
              </div>
            ))}
            <div>
              <label className="text-xs font-medium text-[#7A6870] uppercase tracking-wide">Danh mục</label>
              <select value={newProd.category} onChange={e => setNewProd(p => ({ ...p, category: e.target.value }))}
                className="mt-1 w-full border border-[#DDD4CC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4A5C] bg-white">
                {['Bó hoa', 'Hộp hoa', 'Giỏ hoa', 'Kệ hoa'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={addProduct} className="px-5 py-2 bg-[#8B4A5C] text-white text-sm rounded-xl hover:bg-[#7A3D4F]">Thêm</button>
            <button onClick={() => setShowAdd(false)} className="px-5 py-2 border border-[#DDD4CC] text-sm rounded-xl hover:bg-[#F3ECE7]">Huỷ</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#EDE5DF] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F3ECE7]">
              <tr>
                {['Sản phẩm', 'Danh mục', 'Giá bán', 'Tồn kho', 'Đã bán', 'Trạng thái', 'Thao tác'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#7A6870] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE5DF]">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.img} alt={p.nameVi} className="w-10 h-10 rounded-lg object-cover bg-[#F3ECE7] flex-shrink-0" />
                      <div>
                        {editId === p.id ? (
                          <input defaultValue={p.nameVi} onBlur={e => saveEdit(p.id, 'nameVi', e.target.value)}
                            className="text-sm border-b border-[#8B4A5C] focus:outline-none w-full" />
                        ) : (
                          <div className="font-medium text-[#2C1A2E] line-clamp-1">{p.nameVi}</div>
                        )}
                        <div className="text-xs text-[#7A6870] line-clamp-1">{p.nameKo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#7A6870] whitespace-nowrap">{p.category}</td>
                  <td className="px-4 py-3">
                    {editId === p.id ? (
                      <input type="number" defaultValue={p.price} onBlur={e => saveEdit(p.id, 'price', Number(e.target.value))}
                        className="w-24 text-sm border-b border-[#8B4A5C] focus:outline-none" />
                    ) : (
                      <span className="font-medium text-[#8B4A5C] font-serif">{fmt(p.price)}đ</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editId === p.id ? (
                      <input type="number" defaultValue={p.stock} onBlur={e => saveEdit(p.id, 'stock', Number(e.target.value))}
                        className="w-16 text-sm border-b border-[#8B4A5C] focus:outline-none" />
                    ) : (
                      <span className={`font-medium ${p.stock <= 5 ? 'text-red-600' : 'text-[#2C1A2E]'}`}>{p.stock}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#7A6870]">{p.sold}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(p.id)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${p.active ? 'bg-[#7A9E7E]' : 'bg-[#DDD4CC]'}`}>
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${p.active ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setEditId(editId === p.id ? null : p.id)}
                      className="text-xs px-2.5 py-1 border border-[#DDD4CC] rounded-lg hover:border-[#8B4A5C] transition-colors">
                      {editId === p.id ? 'Xong' : 'Sửa'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Customers Page ───────────────────────────────────────────────────────────
function CustomersPage() {
  const [search, setSearch] = useState('')
  const filtered = CUSTOMERS.filter(c => {
    const q = search.toLowerCase()
    return !q || c.name.toLowerCase().includes(q) || c.phone.includes(q)
  })

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-[#2C1A2E]">Khách hàng</h1>
          <p className="text-sm text-[#7A6870] mt-0.5">{CUSTOMERS.length} khách · {CUSTOMERS.filter(c => c.lang === 'ko').length} người Hàn</p>
        </div>
        <div className="relative max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A6870]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Tìm khách hàng..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 w-full bg-white border border-[#DDD4CC] rounded-xl text-sm focus:outline-none focus:border-[#8B4A5C]" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Tổng khách hàng', value: CUSTOMERS.length, color: 'bg-[#2C1A2E] text-white' },
          { label: 'Khách Hàn Quốc 🇰🇷', value: CUSTOMERS.filter(c => c.lang === 'ko').length, color: 'bg-blue-50 text-blue-700' },
          { label: 'Tổng doanh thu', value: `${fmt(CUSTOMERS.reduce((s, c) => s + c.totalSpent, 0))}đ`, color: 'bg-[#F3ECE7] text-[#2C1A2E]' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-4 ${s.color}`}>
            <div className="text-xs opacity-70 mb-1">{s.label}</div>
            <div className="font-serif text-2xl">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#EDE5DF] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F3ECE7]">
              <tr>
                {['Khách hàng', 'Liên hệ', 'Thành phố', 'Ngôn ngữ', 'Số đơn', 'Chi tiêu', 'Đơn cuối'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#7A6870] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE5DF]">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#F3ECE7] flex items-center justify-center text-sm font-serif text-[#8B4A5C] flex-shrink-0">
                        {c.name[0]}
                      </div>
                      <span className="font-medium text-[#2C1A2E] whitespace-nowrap">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[#2C1A2E]">{c.phone}</div>
                    <div className="text-xs text-[#7A6870]">{c.email}</div>
                  </td>
                  <td className="px-4 py-3 text-[#7A6870] whitespace-nowrap">{c.city}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.lang === 'ko' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {c.lang === 'ko' ? '🇰🇷 한국어' : '🇻🇳 Tiếng Việt'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-[#2C1A2E]">{c.orders}</td>
                  <td className="px-4 py-3 font-serif text-[#8B4A5C] whitespace-nowrap">{fmt(c.totalSpent)}đ</td>
                  <td className="px-4 py-3 text-[#7A6870] whitespace-nowrap">{c.lastOrder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Analytics Page ───────────────────────────────────────────────────────────
function AnalyticsPage() {
  const monthData = [
    { month: 'T3', rev: 42000000, orders: 51 },
    { month: 'T4', rev: 58000000, orders: 69 },
    { month: 'T5', rev: 51000000, orders: 62 },
    { month: 'T6', rev: 73000000, orders: 88 },
    { month: 'T7', rev: 69000000, orders: 81 },
    { month: 'T8', rev: 39150000, orders: 46 },
  ]
  const maxRev = Math.max(...monthData.map(d => d.rev))

  const topProducts = PRODUCTS.sort((a, b) => b.sold - a.sold).slice(0, 5)

  const cityData = [
    { name: 'Hà Nội', pct: 58, orders: 38 },
    { name: 'TP.HCM', pct: 42, orders: 28 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-[#2C1A2E]">Thống kê</h1>
        <p className="text-sm text-[#7A6870] mt-0.5">Phân tích xu hướng & hiệu quả kinh doanh 6 tháng gần nhất</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tổng doanh thu', value: `${fmt(332150000)}đ`, change: '+18%', up: true },
          { label: 'Tổng đơn hàng', value: '397', change: '+22%', up: true },
          { label: 'Khách hàng mới', value: '84', change: '+9%', up: true },
          { label: 'Tỷ lệ huỷ', value: '3.2%', change: '-0.8%', up: false },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#EDE5DF] p-5">
            <div className="text-xs text-[#7A6870] mb-1">{s.label}</div>
            <div className="font-serif text-2xl text-[#2C1A2E]">{s.value}</div>
            <div className={`text-xs mt-1 font-medium ${s.up ? 'text-green-600' : 'text-red-500'}`}>{s.change} so với kỳ trước</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly revenue */}
        <div className="bg-white rounded-2xl border border-[#EDE5DF] p-5">
          <h3 className="font-medium text-[#2C1A2E] mb-4">Doanh thu theo tháng (2026)</h3>
          <div className="flex items-end gap-3 h-44">
            {monthData.map(d => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-xs text-[#7A6870]">{(d.rev / 1000000).toFixed(0)}M</div>
                <div
                  className="w-full bg-gradient-to-t from-[#8B4A5C] to-[#C4818A] rounded-t-lg relative group"
                  style={{ height: `${(d.rev / maxRev) * 100}%`, minHeight: 8 }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#2C1A2E] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                    {d.orders} đơn
                  </div>
                </div>
                <div className="text-xs text-[#7A6870] font-medium">{d.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white rounded-2xl border border-[#EDE5DF] p-5">
          <h3 className="font-medium text-[#2C1A2E] mb-4">Sản phẩm bán chạy nhất</h3>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === 0 ? 'bg-amber-400 text-white' : i === 1 ? 'bg-slate-400 text-white' : i === 2 ? 'bg-orange-400 text-white' : 'bg-[#EDE5DF] text-[#7A6870]'}`}>{i + 1}</span>
                <img src={p.img} alt={p.nameVi} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#2C1A2E] truncate">{p.nameVi}</div>
                  <div className="w-full bg-[#EDE5DF] h-1.5 rounded-full mt-1">
                    <div className="bg-[#8B4A5C] h-1.5 rounded-full" style={{ width: `${(p.sold / topProducts[0].sold) * 100}%` }} />
                  </div>
                </div>
                <span className="text-sm font-semibold text-[#2C1A2E] flex-shrink-0">{p.sold}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* City breakdown */}
        <div className="bg-white rounded-2xl border border-[#EDE5DF] p-5">
          <h3 className="font-medium text-[#2C1A2E] mb-4">Phân bố theo thành phố</h3>
          <div className="space-y-4">
            {cityData.map(c => (
              <div key={c.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-[#2C1A2E]">{c.name}</span>
                  <span className="text-[#7A6870]">{c.orders} đơn · {c.pct}%</span>
                </div>
                <div className="h-3 bg-[#EDE5DF] rounded-full overflow-hidden">
                  <div className="h-full bg-[#8B4A5C] rounded-full" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 pt-4 border-t border-[#EDE5DF]">
            {[
              { label: '🇰🇷 Khách Hàn', value: '86%' },
              { label: '🇻🇳 Khách Việt', value: '14%' },
            ].map(s => (
              <div key={s.label} className="text-center bg-[#FAF7F2] rounded-xl p-3">
                <div className="text-xs text-[#7A6870]">{s.label}</div>
                <div className="font-serif text-2xl text-[#2C1A2E] mt-1">{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment methods */}
        <div className="bg-white rounded-2xl border border-[#EDE5DF] p-5">
          <h3 className="font-medium text-[#2C1A2E] mb-4">Phương thức thanh toán</h3>
          <div className="space-y-3">
            {[
              { name: 'Chuyển khoản', pct: 52, color: 'bg-[#8B4A5C]' },
              { name: 'Momo', pct: 24, color: 'bg-pink-400' },
              { name: 'ZaloPay', pct: 14, color: 'bg-blue-400' },
              { name: 'Tiền mặt', pct: 10, color: 'bg-[#7A9E7E]' },
            ].map(m => (
              <div key={m.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#2C1A2E]">{m.name}</span>
                  <span className="font-medium">{m.pct}%</span>
                </div>
                <div className="h-2 bg-[#EDE5DF] rounded-full overflow-hidden">
                  <div className={`h-full ${m.color} rounded-full`} style={{ width: `${m.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Settings Page ────────────────────────────────────────────────────────────
function SettingsPage() {
  const [settings, setSettings] = useState({
    shopName: 'Hoa Tươi Việt Nam',
    phone: '0901 234 567',
    kakao: 'hoatuoivn',
    zalo: '0901234567',
    addressHN: '24 Xuân Thủy, Cầu Giấy, Hà Nội',
    addressHCM: '88 Lê Lợi, Q.1, TP.HCM',
    openTime: '07:00',
    closeTime: '21:00',
    deliveryFeeHN: '30000',
    deliveryFeeHCM: '40000',
    freeShipFrom: '500000',
    notifyEmail: true,
    notifyZalo: true,
    autoConfirm: false,
  })

  const Field = ({ label, k, type = 'text' }: { label: string; k: keyof typeof settings; type?: string }) => (
    <div>
      <label className="text-xs font-medium text-[#7A6870] uppercase tracking-wide">{label}</label>
      <input
        type={type}
        value={settings[k] as string}
        onChange={e => setSettings(p => ({ ...p, [k]: e.target.value }))}
        className="mt-1 w-full border border-[#DDD4CC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B4A5C] bg-white"
      />
    </div>
  )

  const Toggle = ({ label, desc, k }: { label: string; desc: string; k: keyof typeof settings }) => (
    <div className="flex justify-between items-center py-3 border-b border-[#EDE5DF] last:border-0">
      <div>
        <div className="text-sm font-medium text-[#2C1A2E]">{label}</div>
        <div className="text-xs text-[#7A6870] mt-0.5">{desc}</div>
      </div>
      <button
        onClick={() => setSettings(p => ({ ...p, [k]: !p[k] }))}
        className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${settings[k] ? 'bg-[#7A9E7E]' : 'bg-[#DDD4CC]'}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${settings[k] ? 'left-5' : 'left-0.5'}`} />
      </button>
    </div>
  )

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="font-serif text-3xl text-[#2C1A2E]">Cài đặt</h1>

      <div className="bg-white rounded-2xl border border-[#EDE5DF] p-5">
        <h3 className="font-medium text-[#2C1A2E] mb-4">Thông tin cửa hàng</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Tên cửa hàng" k="shopName" />
          <Field label="Số điện thoại" k="phone" type="tel" />
          <Field label="KakaoTalk ID" k="kakao" />
          <Field label="Zalo" k="zalo" />
          <div className="sm:col-span-2"><Field label="Địa chỉ Hà Nội" k="addressHN" /></div>
          <div className="sm:col-span-2"><Field label="Địa chỉ TP.HCM" k="addressHCM" /></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#EDE5DF] p-5">
        <h3 className="font-medium text-[#2C1A2E] mb-4">Giờ hoạt động & Vận chuyển</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Field label="Mở cửa" k="openTime" type="time" />
          <Field label="Đóng cửa" k="closeTime" type="time" />
          <Field label="Phí ship HN (đ)" k="deliveryFeeHN" type="number" />
          <Field label="Phí ship HCM (đ)" k="deliveryFeeHCM" type="number" />
          <div className="sm:col-span-2"><Field label="Miễn phí ship từ (đ)" k="freeShipFrom" type="number" /></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#EDE5DF] p-5">
        <h3 className="font-medium text-[#2C1A2E] mb-2">Thông báo & Tự động hoá</h3>
        <Toggle label="Thông báo qua Email" desc="Gửi email khi có đơn mới" k="notifyEmail" />
        <Toggle label="Thông báo qua Zalo" desc="Gửi Zalo khi có đơn mới" k="notifyZalo" />
        <Toggle label="Tự động xác nhận đơn" desc="Xác nhận đơn hàng tự động sau 5 phút" k="autoConfirm" />
      </div>

      <button className="px-6 py-3 bg-[#8B4A5C] text-white font-medium rounded-xl hover:bg-[#7A3D4F] transition-colors">
        Lưu thay đổi
      </button>
    </div>
  )
}

// ─── Main Admin App ───────────────────────────────────────────────────────────
export default function AdminApp() {
  const [page, setPage] = useState<AdminPage>('dashboard')
  const [collapsed, setCollapsed] = useState(false)

  const pageMap: Record<AdminPage, React.ReactNode> = {
    dashboard: <Dashboard setPage={setPage} />,
    orders: <OrdersPage />,
    products: <ProductsPage />,
    customers: <CustomersPage />,
    analytics: <AnalyticsPage />,
    settings: <SettingsPage />,
  }

  return (
    <div className="flex min-h-screen bg-[#F5F3F0]">
      <Sidebar page={page} setPage={setPage} collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {pageMap[page]}
        </div>
      </main>
    </div>
  )
}
