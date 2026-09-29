import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ADMIN_PRODUCTS } from '../admin-data';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-analytics.component.html',
  styleUrls: ['./admin-analytics.component.css']
})
export class AdminAnalyticsComponent {
  monthData = [
    { month: 'T3', rev: 42000000, orders: 51 },
    { month: 'T4', rev: 58000000, orders: 69 },
    { month: 'T5', rev: 51000000, orders: 62 },
    { month: 'T6', rev: 73000000, orders: 88 },
    { month: 'T7', rev: 69000000, orders: 81 },
    { month: 'T8', rev: 39150000, orders: 46 },
  ];
  
  maxRev = Math.max(...this.monthData.map(d => d.rev));
  topProducts = [...ADMIN_PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, 5);

  cityData = [
    { name: 'Hà Nội', pct: 58, orders: 38 },
    { name: 'TP.HCM', pct: 42, orders: 28 },
  ];

  stats = [
    { label: 'Tổng doanh thu', value: this.fmt(332150000) + 'đ', change: '+18%', up: true },
    { label: 'Tổng đơn hàng', value: '397', change: '+22%', up: true },
    { label: 'Khách hàng mới', value: '84', change: '+9%', up: true },
    { label: 'Tỷ lệ huỷ', value: '3.2%', change: '-0.8%', up: false },
  ];

  fmt(n: number) {
    return new Intl.NumberFormat('vi-VN').format(n);
  }
}
