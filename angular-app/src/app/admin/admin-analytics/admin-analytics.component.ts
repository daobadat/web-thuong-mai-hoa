import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderApiService } from '../../core/services/order-api.service';
import { ProductApiService } from '../../core/services/product-api.service';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-analytics.component.html',
  styleUrls: ['./admin-analytics.component.css']
})
export class AdminAnalyticsComponent implements OnInit {
  monthData: any[] = [];
  maxRev = 0;
  topProducts: any[] = [];
  cityData: any[] = [];
  stats: any[] = [];

  constructor(
    private orderApi: OrderApiService,
    private productApi: ProductApiService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.orderApi.getAllOrders({ limit: 1000 }).subscribe({
      next: (res: any) => {
        const rawOrders = res.data?.orders || res.data?.data || (Array.isArray(res.data) ? res.data : []);
        this.calculateAnalytics(rawOrders);
      }
    });

    this.productApi.getProducts({ limit: 100 }).subscribe({
      next: (res: any) => {
        const products = res.data?.products || [];
        this.topProducts = products
          .map((p: any) => ({
            name: p.translations?.find((t:any) => t.language_code==='vi')?.name || p.sku,
            sold: Math.floor(Math.random() * 50) + 10, // Mock sold count for now since it's not tracked directly on product
            rev: Number(p.base_price) * 10,
            img: p.images?.[0]?.url || 'https://images.unsplash.com/photo-1680563094046-5d846e2c59d1?w=200&h=200&fit=crop'
          }))
          .sort((a: any, b: any) => b.sold - a.sold)
          .slice(0, 5);
      }
    });
  }

  calculateAnalytics(orders: any[]) {
    const validOrders = orders.filter(o => o.status !== 'cancelled' && o.status !== 'pending');
    const totalRev = validOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
    const totalOrders = orders.length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
    const cancelRate = totalOrders ? (cancelledOrders / totalOrders * 100).toFixed(1) : 0;

    this.stats = [
      { label: 'Tổng doanh thu', value: this.fmt(totalRev) + 'đ', change: 'Mới', up: true },
      { label: 'Tổng đơn hàng', value: totalOrders.toString(), change: 'Mới', up: true },
      { label: 'Đơn hoàn thành', value: validOrders.length.toString(), change: 'Mới', up: true },
      { label: 'Tỷ lệ huỷ', value: cancelRate + '%', change: 'Mới', up: false },
    ];

    // Calculate month data for the current year
    const currentYear = new Date().getFullYear();
    const months = Array(6).fill(0).map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return { monthIndex: d.getMonth(), year: d.getFullYear(), month: `T${d.getMonth() + 1}`, rev: 0, orders: 0 };
    });

    validOrders.forEach(o => {
      const d = new Date(o.created_at);
      const m = months.find(x => x.monthIndex === d.getMonth() && x.year === d.getFullYear());
      if (m) {
        m.rev += Number(o.total_amount);
        m.orders += 1;
      }
    });

    this.monthData = months;
    this.maxRev = Math.max(...this.monthData.map(d => d.rev), 1000000);

    // Calculate city data
    const cityCounts: Record<string, number> = {};
    validOrders.forEach(o => {
      const city = o.delivery_address || 'Khác';
      cityCounts[city] = (cityCounts[city] || 0) + 1;
    });

    const totalValid = validOrders.length || 1;
    this.cityData = Object.entries(cityCounts)
      .map(([name, count]) => ({
        name: name.length > 15 ? name.substring(0, 15) + '...' : name,
        pct: Math.round((count / totalValid) * 100),
        orders: count
      }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 4);
  }

  fmt(n: number) {
    return new Intl.NumberFormat('vi-VN').format(n);
  }
}
