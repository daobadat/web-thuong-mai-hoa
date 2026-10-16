import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { STATUS_CONFIG } from '../admin-data';
import { OrderApiService } from '../../core/services/order-api.service';
import { ProductApiService } from '../../core/services/product-api.service';
import { LangService } from '../../core/services/lang.service';

interface ActionItem {
  id: string;
  labelKey: string;
  count: number;
  icon: string;
  tone: 'danger' | 'warning' | 'info';
  link: string;
  queryParam?: any;
  hintKey: string;
}

interface DeliverySlot {
  id: string;
  label: string;
  startHour: number;
  endHour: number;
  orders: any[];
  isCurrent: boolean;
  hasOverdue: boolean;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  // Loading & Error states
  loadingOrders = true;
  loadingProducts = true;
  ordersError = false;
  productsError = false;
  isRefreshing = false;

  // Real-time & auto-refresh
  lastUpdatedTime = '';
  private pollTimer: any;

  // KPI Metrics
  todayOrders: any[] = [];
  todayRevenue = 0;
  completedTodayCount = 0;
  pendingDeliveryCount = 0;
  revenueDeltaPercent = 12.5;

  // Action Queue
  newOrders: any[] = [];
  unpaidOrders: any[] = [];
  urgentOrders: any[] = [];
  lowStockProducts: any[] = [];
  actionQueue: ActionItem[] = [];

  // Delivery Slots
  slotsConfig = [
    { id: 'morning', label: '08:00 – 12:00', startHour: 8, endHour: 12 },
    { id: 'afternoon', label: '12:00 – 17:00', startHour: 12, endHour: 17 },
    { id: 'evening', label: '17:00 – 21:00', startHour: 17, endHour: 21 },
  ];
  schedule: DeliverySlot[] = [];
  allSlotsEmpty = true;

  // Recent Orders
  recentOrders: any[] = [];
  statusConfig = STATUS_CONFIG;

  // Current Date Header
  currentDateFormatted = '';

  constructor(
    private orderApi: OrderApiService,
    private productApi: ProductApiService,
    public langService: LangService
  ) {}

  ngOnInit() {
    this.initCurrentDate();
    this.loadDashboardData();

    // Auto-poll every 45s for fresh orders
    this.pollTimer = setInterval(() => {
      this.refreshData(true);
    }, 45000);
  }

  ngOnDestroy() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
    }
  }

  get t() {
    return this.langService.t.admin.dashboardView;
  }

  get isKo() {
    return this.langService.currentLang() === 'ko';
  }

  initCurrentDate() {
    const now = new Date();
    if (this.isKo) {
      const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
      const dayName = days[now.getDay()];
      const y = now.getFullYear();
      const m = now.getMonth() + 1;
      const d = now.getDate();
      this.currentDateFormatted = `${y}년 ${m}월 ${d}일 ${dayName}`;
    } else {
      const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const dayName = days[now.getDay()];
      const dateStr = now.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'Asia/Ho_Chi_Minh'
      });
      this.currentDateFormatted = `${dayName}, ${dateStr}`;
    }
    this.updateLastTimestamp();
  }

  updateLastTimestamp() {
    this.lastUpdatedTime = new Date().toLocaleTimeString(this.isKo ? 'ko-KR' : 'vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Ho_Chi_Minh'
    });
  }

  loadDashboardData() {
    this.loadOrders();
    this.loadProducts();
  }

  refreshData(silent = false) {
    if (!silent) this.isRefreshing = true;
    this.initCurrentDate();
    this.loadOrders(() => {
      if (!silent) this.isRefreshing = false;
      this.updateLastTimestamp();
    });
    this.loadProducts();
  }

  loadOrders(onComplete?: () => void) {
    this.loadingOrders = true;
    this.ordersError = false;

    this.orderApi.getAllOrders({ limit: 100 }).subscribe({
      next: (res: any) => {
        const rawOrders = res.data?.orders || res.data?.data || (Array.isArray(res.data) ? res.data : []);
        
        const formattedOrders = rawOrders.map((o: any) => {
          const rawNum = o.order_number || ('#HT-' + o.id.toString().slice(-4).toUpperCase());
          const displayNum = rawNum.startsWith('#') ? rawNum : '#' + rawNum;
          const recipientName = o.recipient_name || o.user?.full_name || (this.isKo ? '방문 고객' : 'Khách vãng lai');
          const isCompany = /công ty|tnhh|cp|corp|inc|ltd|doanh nghiệp|주식회사|기업/i.test(recipientName);

          return {
            ...o,
            id: o.id.toString(),
            displayOrderNumber: displayNum,
            customer: recipientName,
            isCompany,
            status: this.normalizeStatus(o.status),
            total: Number(o.total_amount || 0),
            createdDateVN: new Date(o.created_at).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
            relativeTime: this.formatRelativeTime(o.created_at),
            paymentStatus: o.payment_status === 'paid' ? 'paid' : 'unpaid',
            deliveryTime: o.scheduled_delivery_at 
              ? new Date(o.scheduled_delivery_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute:'2-digit', timeZone: 'Asia/Ho_Chi_Minh' }) 
              : this.t.instantDelivery,
            scheduledDate: o.scheduled_delivery_at 
              ? new Date(o.scheduled_delivery_at).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
              : null,
            itemCount: o.items?.length || 1,
            district: this.extractDistrict(o.delivery_address)
          };
        });

        const todayStr = new Date().toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
        this.todayOrders = formattedOrders.filter((o: any) => o.createdDateVN === todayStr || o.scheduledDate === todayStr);

        this.todayRevenue = this.todayOrders
          .filter((o: any) => o.status !== 'cancelled' && (o.paymentStatus === 'paid' || o.status === 'done'))
          .reduce((sum: number, o: any) => sum + o.total, 0);

        this.completedTodayCount = this.todayOrders.filter((o: any) => o.status === 'done').length;
        this.pendingDeliveryCount = this.todayOrders.filter((o: any) => o.status !== 'cancelled' && o.status !== 'done').length;

        this.newOrders = formattedOrders.filter((o: any) => o.status === 'new');
        this.unpaidOrders = formattedOrders.filter((o: any) => o.paymentStatus === 'unpaid' && o.status !== 'cancelled');
        this.urgentOrders = formattedOrders.filter((o: any) => o.status === 'confirmed' || o.status === 'preparing');

        this.recentOrders = formattedOrders.slice(0, 5);

        this.buildDeliverySchedule();
        this.updateActionQueue();
        this.loadingOrders = false;
        if (onComplete) onComplete();
      },
      error: () => {
        this.loadingOrders = false;
        this.ordersError = true;
        if (onComplete) onComplete();
      }
    });
  }

  loadProducts() {
    this.loadingProducts = true;
    this.productsError = false;

    this.productApi.getProducts({ limit: 100 }).subscribe({
      next: (res: any) => {
        const rawProducts = res.data?.products || [];
        
        const formatted = rawProducts.map((p: any) => {
          const resolvedName = this.resolveProductName(p);
          const resolvedImage = this.resolveProductImage(p);
          const stockNum = p.stock_quantity !== undefined ? Number(p.stock_quantity) : (p.stock !== undefined ? Number(p.stock) : 0);
          
          return {
            ...p,
            id: p.id,
            name: resolvedName,
            img: resolvedImage,
            stock: stockNum,
            threshold: 5,
            categoryName: this.isKo ? (p.category?.nameKo || '생화') : (p.category?.name || p.category?.slug || 'Hoa tươi'),
            price: Number(p.base_price || 0)
          };
        });

        this.lowStockProducts = formatted
          .filter((p: any) => p.stock <= 5)
          .sort((a: any, b: any) => a.stock - b.stock)
          .slice(0, 6);

        this.updateActionQueue();
        this.loadingProducts = false;
      },
      error: () => {
        this.loadingProducts = false;
        this.productsError = true;
      }
    });
  }

  buildDeliverySchedule() {
    const vnNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
    const currentHour = vnNow.getHours();

    let totalSlotOrders = 0;

    this.schedule = this.slotsConfig.map(slot => {
      const isCurrent = currentHour >= slot.startHour && currentHour < slot.endHour;
      const isPast = currentHour >= slot.endHour;

      const slotOrders = this.todayOrders.filter((o: any) => {
        if (!o.scheduled_delivery_at) return false;
        const oDate = new Date(o.scheduled_delivery_at);
        const oHour = oDate.getHours();
        return oHour >= slot.startHour && oHour < slot.endHour;
      });

      totalSlotOrders += slotOrders.length;
      const hasOverdue = isPast && slotOrders.some((o: any) => o.status !== 'done' && o.status !== 'cancelled');

      return {
        ...slot,
        orders: slotOrders,
        isCurrent,
        hasOverdue
      };
    });

    this.allSlotsEmpty = totalSlotOrders === 0;
  }

  updateActionQueue() {
    this.actionQueue = [
      {
        id: 'new_orders',
        labelKey: 'newOrders',
        count: this.newOrders.length,
        icon: 'sparkles',
        tone: 'danger',
        link: '/admin/orders',
        queryParam: { status: 'new' },
        hintKey: 'newOrdersHint'
      },
      {
        id: 'unpaid',
        labelKey: 'unpaid',
        count: this.unpaidOrders.length,
        icon: 'credit_card',
        tone: 'warning',
        link: '/admin/orders',
        queryParam: { status: 'all' },
        hintKey: 'unpaidHint'
      },
      {
        id: 'preparing',
        labelKey: 'preparing',
        count: this.urgentOrders.length,
        icon: 'clock',
        tone: 'info',
        link: '/admin/orders',
        queryParam: { status: 'preparing' },
        hintKey: 'preparingHint'
      },
      {
        id: 'low_stock',
        labelKey: 'lowStock',
        count: this.lowStockProducts.length,
        icon: 'alert',
        tone: 'warning',
        link: '/admin/products',
        hintKey: 'lowStockHint'
      }
    ];
  }

  getActionLabel(key: string): string {
    return (this.t as any)[key] || key;
  }

  resolveProductName(p: any): string {
    const lang = this.langService.currentLang();
    if (p.translations && Array.isArray(p.translations) && p.translations.length > 0) {
      const match = p.translations.find((t: any) => t.language_code === lang);
      if (match?.name) return match.name;
      // Fallback
      const vi = p.translations.find((t: any) => t.language_code === 'vi');
      if (vi?.name) return vi.name;
      if (p.translations[0]?.name) return p.translations[0].name;
    }
    if (lang === 'ko' && p.nameKo) return p.nameKo;
    if (typeof p.name === 'string') return p.name;
    if (p.name && typeof p.name === 'object') {
      return (lang === 'ko' ? p.name.ko : p.name.vi) || p.name.vi || p.name.ko || p.sku || 'Sản phẩm';
    }
    return p.nameVi || p.sku || 'Sản phẩm';
  }

  resolveProductImage(p: any): string {
    if (p.images && Array.isArray(p.images) && p.images.length > 0) {
      const primary = p.images.find((img: any) => img.is_primary);
      return primary?.url || p.images[0]?.url || 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=200&h=200&fit=crop';
    }
    if (typeof p.image_url === 'string' && p.image_url.trim()) return p.image_url;
    if (typeof p.img === 'string' && p.img.trim()) return p.img;
    return 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=200&h=200&fit=crop';
  }

  onImgError(event: any) {
    event.target.src = 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=200&h=200&fit=crop';
  }

  formatRelativeTime(dateString: string): string {
    if (!dateString) return '';
    try {
      const now = new Date().getTime();
      const past = new Date(dateString).getTime();
      const diffMs = now - past;
      const diffMinutes = Math.floor(diffMs / (1000 * 60));

      if (diffMinutes < 1) return this.t.justNow;
      if (diffMinutes < 60) return `${diffMinutes} ${this.t.minsAgo}`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours} ${this.t.hoursAgo}`;
      return new Date(dateString).toLocaleDateString(this.isKo ? 'ko-KR' : 'vi-VN', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Ho_Chi_Minh'
      });
    } catch {
      return '';
    }
  }

  extractDistrict(address: string): string {
    if (!address) return this.isKo ? '시내' : 'Nội thành';
    const match = address.match(/(Quận\s*\d+|Q\.\s*\d+|Quận\s*[\p{L}\s]+|Huyện\s*[\p{L}\s]+|TP\.\s*[\p{L}\s]+)/iu);
    return match ? match[0].trim() : address.split(',').slice(-2, -1)[0]?.trim() || (this.isKo ? '시내' : 'Nội thành');
  }

  normalizeStatus(s: string): string {
    if (s === 'pending') return 'new';
    if (s === 'processing') return 'preparing';
    if (s === 'shipping') return 'delivering';
    if (s === 'delivered') return 'done';
    return s || 'new';
  }

  getStatus(status: any) {
    const config = (this.statusConfig as any)[status] || { cls: 'bg-gray-100 text-gray-700 border border-gray-200', dot: 'bg-gray-400' };
    const label = this.langService.t.admin.status[status as keyof typeof this.langService.t.admin.status] || config.label || status;
    return {
      label,
      cls: config.cls,
      dot: config.dot
    };
  }

  fmt(n: number): string {
    return new Intl.NumberFormat('vi-VN').format(n || 0);
  }
}
