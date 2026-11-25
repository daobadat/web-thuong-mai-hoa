import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserApiService } from '../../core/services/user-api.service';
import { AuthApiService } from '../../core/services/auth-api.service';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-customers.component.html',
  styleUrls: ['./admin-customers.component.css']
})
export class AdminCustomersComponent implements OnInit {
  customers: any[] = [];
  search = '';
  showAdd = false;
  editId: number | null = null;
  
  newCustomer = {
    full_name: '',
    phone: '',
    email: '',
    role: 'customer',
    password: ''
  };

  constructor(
    private userApi: UserApiService,
    private authApi: AuthApiService
  ) {}

  get isAdmin() {
    return this.authApi.currentUser()?.role === 'admin';
  }

  get isStaff() {
    return this.authApi.currentUser()?.role === 'staff';
  }

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.userApi.getUsers().subscribe({
      next: (res) => {
        this.customers = res.data?.data || res.data || [];
        // Map backend names to frontend template if needed
        this.customers = this.customers.map(c => ({
          ...c,
          name: c.full_name,
          lang: c.preferred_language || 'vi',
          city: 'N/A', // Not directly on user model
          orders: 0, // Would need order aggregation
          totalSpent: 0,
          lastOrder: 'N/A',
          isGoogle: c.is_google || c.auth_provider === 'google' || (!c.has_password && c.email?.endsWith('@gmail.com'))
        }));
      }
    });
  }

  get filteredCustomers() {
    const q = this.search.toLowerCase();
    return this.customers.filter(c => {
      const matchName = (c.name || '').toLowerCase().includes(q);
      const matchPhone = (c.phone || '').includes(q);
      const matchEmail = (!this.isAdmin && c.role === 'admin') ? false : (c.email || '').toLowerCase().includes(q);
      return !q || matchName || matchPhone || matchEmail;
    });
  }

  get totalCustomers() {
    return this.customers.length;
  }

  get totalCustomerRole() {
    return this.customers.filter(c => c.role === 'customer').length;
  }

  get totalGoogle() {
    return this.customers.filter(c => c.isGoogle || c.is_google || c.auth_provider === 'google').length;
  }

  get totalKorean() {
    return this.customers.filter(c => c.lang === 'ko').length;
  }

  get totalRevenue() {
    return this.customers.reduce((s, c) => s + c.totalSpent, 0);
  }

  toggleAdd() {
    this.showAdd = !this.showAdd;
  }

  cancelAdd() {
    this.showAdd = false;
  }

  addCustomer() {
    if (!this.newCustomer.full_name || !this.newCustomer.email) return;
    if (!this.isAdmin) this.newCustomer.role = 'customer';
    this.userApi.createUser(this.newCustomer).subscribe({
      next: () => {
        this.showAdd = false;
        this.newCustomer = { full_name: '', phone: '', email: '', role: 'customer', password: '' };
        this.loadCustomers();
      },
      error: (err) => alert(err.message)
    });
  }

  setEditId(id: number) {
    const target = this.customers.find(c => c.id === id);
    if (!this.isAdmin && target && target.role !== 'customer') {
      alert('Nhân viên chỉ có quyền chỉnh sửa thông tin khách hàng!');
      return;
    }
    this.editId = this.editId === id ? null : id;
  }

  saveEditString(id: number, field: string, value: string) {
    if (field === 'role' && !this.isAdmin) {
      alert('Chỉ có quản trị viên mới được phép chỉnh sửa vai trò!');
      return;
    }

    // Map template field to backend field
    let backendField = field;
    if (field === 'name') backendField = 'full_name';
    
    this.userApi.updateUser(id, { [backendField]: value }).subscribe({
      next: () => {
        // Update local state without full reload for instant feedback
        this.customers = this.customers.map(c => c.id === id ? { ...c, [field]: value } : c);
      },
      error: (err) => alert(err.message)
    });
  }

  deleteCustomer(id: number) {
    const target = this.customers.find(c => c.id === id);
    if (!this.isAdmin && target && target.role !== 'customer') {
      alert('Nhân viên chỉ có quyền xóa tài khoản khách hàng!');
      return;
    }
    if(confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
      this.userApi.deleteUser(id).subscribe({
        next: () => this.loadCustomers(),
        error: (err) => alert(err.message)
      });
    }
  }

  fmt(n: number) {
    return new Intl.NumberFormat('vi-VN').format(n);
  }
}
