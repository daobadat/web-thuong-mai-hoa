import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Order, OrderStatus, STATUS_CONFIG } from '../admin-data';
import { OrderApiService } from '../../core/services/order-api.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  statusFilter: OrderStatus | 'all' = 'all';
  search = '';
  selected: Order | null = null;
  statusConfig = STATUS_CONFIG;

  STATUS_FLOW: Record<OrderStatus, OrderStatus | null> = {
    new: 'confirmed', confirmed: 'preparing', preparing: 'delivering', delivering: 'done', done: null, cancelled: null,
  };

  statusKeys: (OrderStatus | 'all')[] = ['all', 'new', 'confirmed', 'preparing', 'delivering', 'done', 'cancelled'];

  constructor(private orderApi: OrderApiService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderApi.getAllOrders({ limit: 100 }).subscribe({
      next: (res: any) => {
        // Backend returns: { success: true, data: { total, page, orders: [...] } }
        const rawOrders = res.data?.orders || res.data?.data || (Array.isArray(res.data) ? res.data : []);
        this.orders = rawOrders.map((o: any) => ({
          ...o,
          id: o.id.toString(),
          status: o.status === 'pending' ? 'new' : o.status === 'processing' ? 'preparing' : o.status === 'shipping' ? 'delivering' : o.status === 'delivered' ? 'done' : o.status,
          customer: o.recipient_name,
          phone: o.recipient_phone,
          address: o.delivery_address,
          city: o.delivery_address || '',
          date: new Date(o.created_at).toLocaleDateString('vi-VN'),
          time: new Date(o.created_at).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}),
          deliveryTime: o.scheduled_delivery_at ? new Date(o.scheduled_delivery_at).toLocaleDateString('vi-VN') : 'Giao ngay',
          payment: o.payment_method === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : o.payment_method === 'bank_transfer' ? 'Chuyển khoản' : o.payment_method || 'Chưa rõ',
          paymentStatus: o.payment_status === 'paid' ? 'paid' : 'unpaid',
          total: o.total_amount,
          products: o.items?.map((i: any) => ({
            name: i.product_name_snapshot || 'Sản phẩm',
            qty: i.quantity,
            price: i.unit_price
          })) || [],
          message: o.card_message || '',
          note: o.notes || ''
        }));
      }
    });
  }

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
    
    // Map status back to backend if needed
    let backendStatus = status;
    if (status === 'new') backendStatus = 'pending' as any;
    if (status === 'preparing') backendStatus = 'processing' as any;
    if (status === 'delivering') backendStatus = 'shipping' as any;
    if (status === 'done') backendStatus = 'delivered' as any;

    this.orderApi.updateOrderStatus(id as any, backendStatus).subscribe({
      next: () => {
        this.orders = this.orders.map(o => o.id === id ? { ...o, status } : o);
        if (this.selected?.id === id) {
          this.selected = { ...this.selected, status };
        }
      },
      error: (err) => alert(err.message)
    });
  }

  cancelOrder(id: string) {
    this.updateStatus(id, 'cancelled');
  }

  deleteOrder(id: string) {
    if(confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      this.orderApi.deleteOrder(id as any).subscribe({
        next: () => {
          this.orders = this.orders.filter(o => o.id !== id);
          if(this.selected?.id === id) {
            this.selected = null;
          }
        },
        error: (err) => alert(err.message)
      });
    }
  }

  fmt(n: number) {
    return new Intl.NumberFormat('vi-VN').format(n);
  }
}
