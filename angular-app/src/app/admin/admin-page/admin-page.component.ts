import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent {
  collapsed = false;

  navItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: '◉', link: '/admin/dashboard' },
    { id: 'orders', label: 'Đơn hàng', icon: '📦', link: '/admin/orders' },
    { id: 'products', label: 'Sản phẩm', icon: '🌸', link: '/admin/products' },
    { id: 'categories', label: 'Danh mục', icon: '🗂️', link: '/admin/categories' },
    { id: 'customers', label: 'Khách hàng', icon: '👤', link: '/admin/customers' },
    { id: 'analytics', label: 'Thống kê', icon: '📊', link: '/admin/analytics' },
    { id: 'settings', label: 'Cài đặt', icon: '⚙️', link: '/admin/settings' },
  ];

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }
}
