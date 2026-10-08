import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface CheckoutPayload {
  coupon_code?: string;
  recipient_name: string;
  recipient_phone: string;
  delivery_address: string;
  delivery_date?: string;
  delivery_time_slot_id?: number;
  card_message?: string;
  payment_method: 'bank_transfer' | 'momo' | 'zalopay' | 'cod';
  note?: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  variant_id?: number;
  quantity: number;
  unit_price: number;
  product_name_snapshot: string;
}

export interface Order {
  id: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
  total_amount: number;
  discount_amount?: number;
  recipient_name: string;
  recipient_phone: string;
  delivery_address: string;
  delivery_date?: string;
  card_message?: string;
  payment_method: string;
  items: OrderItem[];
  status_history?: any[];
  created_at: string;
}

export interface OrderListResponse {
  success: boolean;
  data: Order[];
}

export interface OrderDetailResponse {
  success: boolean;
  data: Order;
}

@Injectable({ providedIn: 'root' })
export class OrderApiService {
  constructor(private api: ApiService) {}

  checkout(payload: CheckoutPayload): Observable<OrderDetailResponse> {
    return this.api.post<OrderDetailResponse>('/orders/checkout', payload);
  }

  getMyOrders(): Observable<OrderListResponse> {
    return this.api.get<OrderListResponse>('/orders/my-orders');
  }

  getOrder(id: number): Observable<OrderDetailResponse> {
    return this.api.get<OrderDetailResponse>(`/orders/${id}`);
  }

  // Admin / Staff only
  getAllOrders(params?: any): Observable<OrderListResponse> {
    return this.api.get<OrderListResponse>('/orders', params);
  }

  updateOrderStatus(id: string, status: string, note?: string): Observable<any> {
    return this.api.put(`/orders/${id}/status`, { status, note });
  }

  deleteOrder(id: string): Observable<any> {
    return this.api.delete(`/orders/${id}`);
  }

  /** Tạo URL thanh toán MoMo */
  createMomoPayment(orderId: string, orderNumber: string, totalAmount: number): Observable<any> {
    return this.api.post<any>('/payments/momo-create', { orderId, orderNumber, totalAmount });
  }

  /** Tạo URL thanh toán VNPay */
  createVnpayPayment(orderId: string, orderNumber: string, totalAmount: number): Observable<any> {
    return this.api.post<any>('/payments/vnpay-create', { orderId, orderNumber, totalAmount });
  }

  /** Poll trạng thái thanh toán */
  getPaymentStatus(orderNumber: string): Observable<any> {
    return this.api.get<any>(`/payments/status/${orderNumber}`);
  }
}
