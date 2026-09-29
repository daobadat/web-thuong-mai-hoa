import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ADMIN_ORDERS, Order, OrderStatus, STATUS_CONFIG } from '../admin-data';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent {
  orders = [...ADMIN_ORDERS];
  statusFilter: OrderStatus | 'all' = 'all';
  search = '';
  selected: Order | null = null;
  statusConfig = STATUS_CONFIG;

  STATUS_FLOW: Record<OrderStatus, OrderStatus | null> = {
    new: 'confirmed', confirmed: 'preparing', preparing: 'delivering', delivering: 'done', done: null, cancelled: null,
  };

  statusKeys: (OrderStatus | 'all')[] = ['all', 'new', 'confirmed', 'preparing', 'delivering', 'done', 'cancelled'];

  get filteredOrders() {
    return this.orders.filter(o => {
      const matchStatus = this.statusFilter === 'all' || o.status === this.statusFilter;
      const q = this.search.toLowerCase();
      return matchStatus && (!q || o.customer.toLowerCase().includes(q) || o.id.toLowerCase().includes(q));
    });
  }

  setStatusFilter(s: OrderStatus | 'all') {
    this.statusFilter = s;
  }

  selectOrder(o: Order) {
    this.selected = o;
  }

  closeSelected() {
    this.selected = null;
  }

  updateStatus(id: string, status: OrderStatus | null) {
    if (!status) return;
    this.orders = this.orders.map(o => o.id === id ? { ...o, status } : o);
    if (this.selected?.id === id) {
      this.selected = { ...this.selected, status };
    }
  }

  cancelOrder(id: string) {
    this.updateStatus(id, 'cancelled');
  }

  fmt(n: number) {
    return new Intl.NumberFormat('vi-VN').format(n);
  }
}
