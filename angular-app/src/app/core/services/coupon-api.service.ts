import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface BackendCoupon {
  id: number;
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  min_order_value?: number;
  max_discount_amount?: number;
  start_date?: string;
  end_date?: string;
  usage_limit?: number;
  used_count?: number;
  is_active: boolean;
  created_at?: string;
}

export interface CouponApplyRequest {
  coupon_code: string;
  subtotal: number;
}

export interface CouponApplyResponse {
  success: boolean;
  data: {
    discount_amount: number;
    final_total: number;
    coupon: BackendCoupon;
  };
}

export interface CouponListResponse {
  success: boolean;
  data: BackendCoupon[];
}

@Injectable({ providedIn: 'root' })
export class CouponApiService {
  constructor(private api: ApiService) {}

  applyCoupon(data: CouponApplyRequest): Observable<CouponApplyResponse> {
    return this.api.post<CouponApplyResponse>('/coupons/apply', data);
  }

  getCoupons(): Observable<CouponListResponse> {
    return this.api.get<CouponListResponse>('/coupons');
  }

  createCoupon(data: any): Observable<{ success: boolean; data: BackendCoupon }> {
    return this.api.post<{ success: boolean; data: BackendCoupon }>('/coupons', data);
  }

  updateCoupon(id: number, data: any): Observable<{ success: boolean; data: BackendCoupon }> {
    return this.api.put<{ success: boolean; data: BackendCoupon }>(`/coupons/${id}`, data);
  }

  deleteCoupon(id: number): Observable<any> {
    return this.api.delete(`/coupons/${id}`);
  }
}
