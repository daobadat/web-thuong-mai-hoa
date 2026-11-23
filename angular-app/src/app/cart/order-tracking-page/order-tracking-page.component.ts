import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LangService } from '../../core/services/lang.service';
import { OrderApiService } from '../../core/services/order-api.service';

@Component({
  selector: 'app-order-tracking-page',
  templateUrl: './order-tracking-page.component.html',
  styleUrls: ['./order-tracking-page.component.css'],
  standalone: false
})
export class OrderTrackingPageComponent implements OnInit {
  langService = inject(LangService);
  private orderApi = inject(OrderApiService);
  private route = inject(ActivatedRoute);

  orderCode = '';
  order: any = null;
  loading = false;
  hasSearched = false;
  notFound = false;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const code = params['code'] || params['orderId'];
      if (code) {
        this.orderCode = code;
        this.searchOrder();
      }
    });
  }

  searchOrder() {
    if (!this.orderCode || !this.orderCode.trim()) return;
    this.loading = true;
    this.hasSearched = true;
    this.notFound = false;
    this.order = null;

    this.orderApi.trackOrder(this.orderCode.trim()).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.order = res.data || res;
        this.notFound = !this.order;
      },
      error: () => {
        this.loading = false;
        this.notFound = true;
      }
    });
  }

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
      case 'processing': return isVi ? 'Đang chuẩn bị & cắm hoa' : '꽃 제작 중';
      case 'ready_for_delivery': return isVi ? 'Sẵn sàng giao' : '배송 준비';
      case 'out_for_delivery':
      case 'shipping': return isVi ? 'Đang giao hoa' : '배송 중';
      case 'delivered': return isVi ? 'Giao thành công' : '배송 완료';
      case 'cancelled': return isVi ? 'Đã hủy' : '주문 취소';
      default: return status;
    }
  }

  getDeliveryDate(order: any): string {
    const raw = order?.scheduled_delivery_at || order?.delivery_date;
    if (!raw) return this.langService.currentLang() === 'vi' ? 'Giao nhanh 2 - 4h' : '빠른 배송 (2~4시간)';
    try {
      const d = new Date(raw);
      return d.toLocaleDateString('vi-VN', { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' });
    } catch (_) {
      return String(raw);
    }
  }

  formatPrice(n: any): string {
    return new Intl.NumberFormat('vi-VN').format(Math.round(Number(n) || 0));
  }
}
