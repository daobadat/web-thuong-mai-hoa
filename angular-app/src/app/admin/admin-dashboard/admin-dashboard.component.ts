import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { STATUS_CONFIG } from '../admin-data';
import { OrderApiService } from '../../core/services/order-api.service';
import { ProductApiService } from '../../core/services/product-api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  todayOrders: any[] = [];
  todayRevenue = 0;
  newOrders: any[] = [];
  deliveringOrders: any[] = [];
  unpaidOrders: any[] = [];
  lowStock: any[] = [];
  recentOrders: any[] = [];
  statusConfig = STATUS_CONFIG;

  actionQueue: any[] = [];
  slots = ['08:00–12:00', '12:00–17:00', '17:00–21:00'];
  schedule: any[] = [];

  constructor(
    private orderApi: OrderApiService,
    private productApi: ProductApiService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Tải đơn hàng mới nhất
    this.orderApi.getAllOrders({ limit: 100 }).subscribe({
      next: (res: any) => {
        const rawOrders = res.data?.orders || res.data?.data || (Array.isArray(res.data) ? res.data : []);
        const formattedOrders = rawOrders.map((o: any) => ({
          ...o,
          id: o.id.toString(),
          status: o.status === 'pending' ? 'new' : o.status === 'processing' ? 'preparing' : o.status === 'shipping' ? 'delivering' : o.status === 'delivered' ? 'done' : o.status,
          customer: o.recipient_name,
          total: Number(o.total_amount),
          date: new Date(o.created_at).toLocaleDateString('vi-VN'),
          paymentStatus: o.payment_status === 'paid' ? 'paid' : 'unpaid',
          deliveryTime: o.scheduled_delivery_at ? new Date(o.scheduled_delivery_at).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) : 'Giao ngay'
        }));

        const todayStr = new Date().toLocaleDateString('vi-VN');
        this.todayOrders = formattedOrders.filter((o: any) => o.date === todayStr);
        this.todayRevenue = this.todayOrders.filter((o: any) => o.status !== 'cancelled').reduce((s: number, o: any) => s + o.total, 0);
        this.newOrders = formattedOrders.filter((o: any) => o.status === 'new');
        this.deliveringOrders = formattedOrders.filter((o: any) => o.status === 'delivering');
        this.unpaidOrders = formattedOrders.filter((o: any) => o.paymentStatus === 'unpaid' && o.status !== 'cancelled');
        this.recentOrders = formattedOrders.slice(0, 5);

        this.schedule = this.slots.map(slot => ({
          slot,
          orders: this.todayOrders.filter((o: any) => {
            // Very simplified slot mapping for UI demonstration
            if (o.deliveryTime === 'Giao ngay') return false;
            const hour = parseInt(o.deliveryTime.split(':')[0]);
            if (slot === '08:00–12:00' && hour >= 8 && hour < 12) return true;
            if (slot === '12:00–17:00' && hour >= 12 && hour < 17) return true;
            if (slot === '17:00–21:00' && hour >= 17 && hour <= 21) return true;
            return false;
          }),
        }));

        this.updateActionQueue();
      }
    });

    // Tải sản phẩm
    this.productApi.getProducts({ limit: 100 }).subscribe({
      next: (res: any) => {
        const products = res.data?.products || [];
        this.lowStock = products.filter((p: any) => Number(p.stock_quantity) <= 5);
        this.updateActionQueue();
      }
    });
  }

  updateActionQueue() {
    this.actionQueue = [
      { label: 'Đơn mới chờ xác nhận', count: this.newOrders.length, icon: '🆕', cls: 'bg-purple-50 text-purple-700 border-purple-100', link: '/admin/orders' },
      { label: 'Đơn đang trên đường giao', count: this.deliveringOrders.length, icon: '🚚', cls: 'bg-orange-50 text-orange-700 border-orange-100', link: '/admin/orders' },
      { label: 'Đơn chưa thanh toán', count: this.unpaidOrders.length, icon: '💳', cls: 'bg-red-50 text-red-600 border-red-100', link: '/admin/orders' },
      { label: 'Sản phẩm sắp hết hàng', count: this.lowStock.length, icon: '⚠️', cls: 'bg-amber-50 text-amber-700 border-amber-100', link: '/admin/products' },
    ];
  }

  getCompletedToday() {
    return this.todayOrders.filter(o => o.status === 'done').length;
  }

  getPendingToday() {
    return this.todayOrders.filter(o => o.status !== 'cancelled' && o.status !== 'done').length;
  }

  getStatus(status: any) {
    return (this.statusConfig as any)[status] || { label: status, cls: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' };
  }

  fmt(n: number) {
    return new Intl.NumberFormat('vi-VN').format(n);
  }
}
