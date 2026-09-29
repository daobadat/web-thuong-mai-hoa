import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ADMIN_ORDERS, ADMIN_PRODUCTS, STATUS_CONFIG } from '../admin-data';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  todayOrders = ADMIN_ORDERS.filter(o => o.date === '17/08/2026');
  todayRevenue = this.todayOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  newOrders = ADMIN_ORDERS.filter(o => o.status === 'new');
  deliveringOrders = ADMIN_ORDERS.filter(o => o.status === 'delivering');
  unpaidOrders = ADMIN_ORDERS.filter(o => o.paymentStatus === 'unpaid' && o.status !== 'cancelled');
  lowStock = ADMIN_PRODUCTS.filter(p => p.stock <= 5);
  recentOrders = ADMIN_ORDERS.slice(0, 5);
  statusConfig = STATUS_CONFIG;

  actionQueue = [
    { label: 'Đơn mới chờ xác nhận', count: this.newOrders.length, icon: '🆕', cls: 'bg-purple-50 text-purple-700 border-purple-100', link: '/admin/orders' },
    { label: 'Đơn đang trên đường giao', count: this.deliveringOrders.length, icon: '🚚', cls: 'bg-orange-50 text-orange-700 border-orange-100', link: '/admin/orders' },
    { label: 'Đơn chưa thanh toán', count: this.unpaidOrders.length, icon: '💳', cls: 'bg-red-50 text-red-600 border-red-100', link: '/admin/orders' },
    { label: 'Sản phẩm sắp hết hàng', count: this.lowStock.length, icon: '⚠️', cls: 'bg-amber-50 text-amber-700 border-amber-100', link: '/admin/products' },
  ];

  slots = ['08:00–12:00', '12:00–17:00', '17:00–21:00'];
  schedule = this.slots.map(slot => ({
    slot,
    orders: this.todayOrders.filter(o => o.deliveryTime === slot && o.status !== 'cancelled'),
  }));

  getCompletedToday() {
    return this.todayOrders.filter(o => o.status === 'done').length;
  }

  getPendingToday() {
    return this.todayOrders.filter(o => o.status !== 'cancelled' && o.status !== 'done').length;
  }

  fmt(n: number) {
    return new Intl.NumberFormat('vi-VN').format(n);
  }
}
