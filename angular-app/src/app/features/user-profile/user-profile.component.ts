import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthApiService, AuthUser } from '../../core/services/auth-api.service';
import { UserApiService, UserAddress } from '../../core/services/user-api.service';
import { OrderApiService, Order } from '../../core/services/order-api.service';
import { LangService } from '../../core/services/lang.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    preferred_language: 'vi'
  };

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
  orders: Order[] = [];

  // States
  isSaving = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    public authApi: AuthApiService,
    private userApi: UserApiService,
    private orderApi: OrderApiService,
    public langService: LangService
  ) {}

  ngOnInit() {
    this.user = this.authApi.currentUser();
    if (this.user) {
      this.formData.full_name = this.user.full_name || '';
      this.formData.phone = this.user.phone || '';
      this.formData.preferred_language = this.user.preferred_language || 'vi';
    }
    
    // Check URL hash for tab (e.g. #orders)
    const hash = window.location.hash.replace('#', '');
    if (['profile', 'addresses', 'orders', 'security'].includes(hash)) {
      this.activeTab = hash as any;
    }
    
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

  // --- Orders Logic ---
  loadOrders() {
    this.orderApi.getMyOrders().subscribe({
      next: (res) => {
        this.orders = res.data;
      }
    });
  }
}
