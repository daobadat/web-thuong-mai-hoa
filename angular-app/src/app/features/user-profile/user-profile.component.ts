import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthApiService, AuthUser } from '../../core/services/auth-api.service';
import { UserApiService, UserAddress } from '../../core/services/user-api.service';
import { OrderApiService, Order } from '../../core/services/order-api.service';
import { LangService } from '../../core/services/lang.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  user: AuthUser | null = null;
  activeTab: 'profile' | 'addresses' | 'orders' | 'security' = 'profile';

  // Profile Form
  formData = {
    full_name: '',
    phone: '',
    preferred_language: 'vi',
    avatar_url: ''
  };
  avatarPreview: string | null = null;

  // Password Form
  passwordData = {
    old_password: '',
    new_password: '',
    confirm_password: ''
  };

  // Address Form
  showAddressForm = false;
  editingAddressId: number | null = null;
  addressData: any = {
    recipient_name: '',
    recipient_phone: '',
    address_line: '',
    ward: '',
    district: '',
    city: '',
    is_default: false
  };
  addresses: UserAddress[] = [];

  // Orders
  orders: any[] = [];
  orderFilter: string = 'all';
  expandedOrderId: string | number | null = null;
  loadingOrders = false;

  // States
  isSaving = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    public authApi: AuthApiService,
    private userApi: UserApiService,
    private orderApi: OrderApiService,
    public langService: LangService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.user = this.authApi.currentUser();
    if (this.user) {
      this.formData.full_name = this.user.full_name || '';
      this.formData.phone = this.user.phone || '';
      this.formData.preferred_language = this.user.preferred_language || 'vi';
      this.formData.avatar_url = this.user.avatar_url || '';
      this.avatarPreview = this.user.avatar_url || null;
    }

    // Check URL hash for tab (e.g. #orders)
    const hash = window.location.hash.replace('#', '');
    if (['profile', 'addresses', 'orders', 'security'].includes(hash)) {
      this.activeTab = hash as any;
    }

    // Check query params (e.g. ?tab=orders)
    this.route.queryParams.subscribe(params => {
      if (params['tab'] && ['profile', 'addresses', 'orders', 'security'].includes(params['tab'])) {
        this.activeTab = params['tab'] as any;
        this.loadTabData();
      }
    });

    this.loadTabData();
  }

  switchTab(tab: 'profile' | 'addresses' | 'orders' | 'security') {
    this.activeTab = tab;
    this.errorMessage = '';
    this.successMessage = '';
    window.location.hash = tab;
    this.loadTabData();
  }

  loadTabData() {
    if (this.activeTab === 'addresses') {
      this.loadAddresses();
    } else if (this.activeTab === 'orders') {
      this.loadOrders();
    }
  }

  // --- Profile Logic ---
  onAvatarFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      this.errorMessage = this.langService.currentLang() === 'vi' ? 'Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, GIF, WebP)' : '유효한 이미지 파일을 선택해주세요';
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.errorMessage = this.langService.currentLang() === 'vi' ? 'Kích thước file ảnh không được vượt quá 10MB' : '파일 크기는 10MB를 초과할 수 없습니다';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 300;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const minSide = Math.min(img.width, img.height);
          const startX = (img.width - minSide) / 2;
          const startY = (img.height - minSide) / 2;
          ctx.drawImage(img, startX, startY, minSide, minSide, 0, 0, size, size);
          const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.88);
          this.avatarPreview = optimizedBase64;
          this.formData.avatar_url = optimizedBase64;
          this.saveProfile();
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  removeAvatar() {
    this.avatarPreview = null;
    this.formData.avatar_url = '';
    this.saveProfile();
  }

  saveProfile() {
    if (!this.formData.full_name) {
      this.errorMessage = this.langService.currentLang() === 'vi' ? 'Vui lòng nhập họ tên' : '이름을 입력해주세요';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userApi.updateProfile(this.formData).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.successMessage = this.langService.currentLang() === 'vi' ? 'Cập nhật thành công!' : '성공적으로 업데이트되었습니다!';
        if (this.user) {
          const updatedUser = { ...this.user, ...this.formData };
          this.user = updatedUser;
          this.authApi.currentUser.set(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        this.authApi.getMe().subscribe();
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.message || 'Lỗi cập nhật';
      }
    });
  }

  // --- Security Logic ---
  changePassword() {
    if (!this.passwordData.old_password || !this.passwordData.new_password) {
      this.errorMessage = this.langService.currentLang() === 'vi' ? 'Vui lòng nhập đủ thông tin' : '정보를 모두 입력해주세요';
      return;
    }
    if (this.passwordData.new_password !== this.passwordData.confirm_password) {
      this.errorMessage = this.langService.currentLang() === 'vi' ? 'Mật khẩu xác nhận không khớp' : '비밀번호가 일치하지 않습니다';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userApi.changePassword({
      old_password: this.passwordData.old_password,
      new_password: this.passwordData.new_password
    }).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.successMessage = this.langService.currentLang() === 'vi' ? 'Đổi mật khẩu thành công!' : '비밀번호 변경 완료!';
        this.passwordData = { old_password: '', new_password: '', confirm_password: '' };
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.message || 'Lỗi đổi mật khẩu';
      }
    });
  }

  // --- Addresses Logic ---
  loadAddresses() {
    this.userApi.getAddresses().subscribe({
      next: (res) => {
        this.addresses = res.data;
      }
    });
  }

  toggleAddressForm() {
    this.showAddressForm = !this.showAddressForm;
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.showAddressForm) {
      this.resetAddressForm();
    }
  }

  resetAddressForm() {
    this.editingAddressId = null;
    this.addressData = {
      recipient_name: '',
      recipient_phone: '',
      address_line: '',
      ward: '',
      district: '',
      city: '',
      is_default: false
    };
  }

  editAddress(addr: UserAddress) {
    this.editingAddressId = addr.id;
    this.addressData = { ...addr };
    this.showAddressForm = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  saveAddress() {
    if (!this.addressData.recipient_name || !this.addressData.recipient_phone || !this.addressData.address_line || !this.addressData.city || !this.addressData.district) {
      this.errorMessage = this.langService.currentLang() === 'vi' ? 'Vui lòng điền đủ thông tin bắt buộc' : '필수 정보를 모두 입력해주세요';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const request$ = this.editingAddressId
      ? this.userApi.updateAddress(this.editingAddressId, this.addressData)
      : this.userApi.addAddress(this.addressData);

    request$.subscribe({
      next: (res) => {
        this.isSaving = false;
        this.showAddressForm = false;
        this.resetAddressForm();
        this.loadAddresses();
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.message || 'Lỗi lưu địa chỉ';
      }
    });
  }

  deleteAddress(id: number) {
    if (confirm(this.langService.currentLang() === 'vi' ? 'Bạn có chắc chắn muốn xóa địa chỉ này?' : '이 주소를 삭제하시겠습니까?')) {
      this.userApi.deleteAddress(id).subscribe({
        next: () => this.loadAddresses(),
        error: (err) => alert(err.message)
      });
    }
  }

  // --- Orders & Tracking Logic ---
  loadOrders() {
    this.loadingOrders = true;
    this.orderApi.getMyOrders().subscribe({
      next: (res: any) => {
        this.loadingOrders = false;
        const list = res.data?.orders || (Array.isArray(res.data) ? res.data : []);
        this.orders = list;
        // Mặc định mở đơn hàng đầu tiên để xem ngay tiến trình
        if (this.orders.length > 0 && !this.expandedOrderId) {
          this.expandedOrderId = this.orders[0].id;
        }
      },
      error: () => {
        this.loadingOrders = false;
      }
    });
  }

  get filteredOrders(): any[] {
    if (this.orderFilter === 'all') return this.orders;
    if (this.orderFilter === 'pending') return this.orders.filter(o => o.status === 'pending');
    if (this.orderFilter === 'processing') return this.orders.filter(o => o.status === 'confirmed' || o.status === 'processing');
    if (this.orderFilter === 'shipping') return this.orders.filter(o => o.status === 'out_for_delivery' || o.status === 'shipping' || o.status === 'ready_for_delivery');
    if (this.orderFilter === 'delivered') return this.orders.filter(o => o.status === 'delivered');
    if (this.orderFilter === 'cancelled') return this.orders.filter(o => o.status === 'cancelled');
    return this.orders;
  }

  setOrderFilter(f: string) {
    this.orderFilter = f;
  }

  toggleOrderDetails(orderId: any) {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  /**
   * Tính bước tiến trình đơn hàng (1 -> 4)
   * 1: Đã tiếp nhận đơn
   * 2: Chuẩn bị & Cắm hoa tươi
   * 3: Đang giao hoa
   * 4: Giao hoa thành công
   * 0: Đã hủy
   */
  getOrderStep(status: string): number {
    switch (status) {
      case 'pending': return 1;
      case 'confirmed':
      case 'processing': return 2;
      case 'ready_for_delivery':
      case 'out_for_delivery':
      case 'shipping': return 3;
      case 'delivered': return 4;
      case 'cancelled': return 0;
      default: return 1;
    }
  }

  getStatusLabel(status: string): string {
    const isVi = this.langService.currentLang() === 'vi';
    switch (status) {
      case 'pending': return isVi ? 'Chờ xác nhận' : '접수 대기';
      case 'confirmed': return isVi ? 'Đã xác nhận' : '주문 확인';
      case 'processing': return isVi ? 'Đang chuẩn bị & Cắm hoa' : '꽃 제작 중';
      case 'ready_for_delivery': return isVi ? 'Sẵn sàng giao' : '배송 준비';
      case 'out_for_delivery':
      case 'shipping': return isVi ? 'Đang giao hoa' : '배송 중';
      case 'delivered': return isVi ? 'Giao thành công' : '배송 완료';
      case 'cancelled': return isVi ? 'Đã hủy' : '주문 취소';
      default: return status;
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'confirmed':
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready_for_delivery':
      case 'out_for_delivery':
      case 'shipping': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelled': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  getPaymentMethodName(method: string): string {
    const isVi = this.langService.currentLang() === 'vi';
    switch (method) {
      case 'bank_transfer': return isVi ? 'Chuyển khoản (VietQR)' : '계좌이체 (VietQR)';
      case 'momo': return 'Ví MoMo';
      case 'vnpay':
      case 'zalopay': return 'VNPay';
      case 'cod': return isVi ? 'Thanh toán khi nhận (COD)' : '착불 (COD)';
      default: return method || (isVi ? 'Chuyển khoản' : '계좌이체');
    }
  }

  getDeliveryTimeFormatted(order: any): string {
    const isVi = this.langService.currentLang() === 'vi';
    const rawDate = order.scheduled_delivery_at || order.delivery_date;
    if (!rawDate) {
      return isVi ? 'Giao tiêu chuẩn (2 - 4 giờ)' : '표준 배송 (2~4시간)';
    }
    try {
      const d = new Date(rawDate);
      if (isNaN(d.getTime())) return String(rawDate);
      return d.toLocaleDateString(isVi ? 'vi-VN' : 'ko-KR', {
        weekday: 'short',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      });
    } catch (_) {
      return String(rawDate);
    }
  }

  formatPrice(n: any): string {
    const val = Number(n) || 0;
    return new Intl.NumberFormat('vi-VN').format(Math.round(val));
  }

  /** Lấy timestamp cho từng bước từ statusHistory nếu có */
  getStepTime(order: any, stepNum: number): string {
    if (!order.statusHistory || !Array.isArray(order.statusHistory)) return '';
    const statusMap: Record<number, string[]> = {
      1: ['pending', 'created'],
      2: ['confirmed', 'processing'],
      3: ['ready_for_delivery', 'out_for_delivery', 'shipping'],
      4: ['delivered']
    };
    const targetStatuses = statusMap[stepNum] || [];
    const record = order.statusHistory.find((h: any) => targetStatuses.includes(h.status));
    if (record && record.created_at) {
      const d = new Date(record.created_at);
      return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }
    return '';
  }
}
