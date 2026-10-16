import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface AnalyticsKPI {
  revenue: number;
  totalOrders: number;
  completedOrders: number;
  cancelRate: number;
}

export interface AnalyticsKPIDelta {
  revenue: number | null;
  totalOrders: number | null;
  completedOrders: number | null;
  cancelRate: number | null;
}

export interface MonthlyRevenueItem {
  month: string;
  label: string;
  revenue: number;
  orders: number;
  isCurrentMonth: boolean;
}

export interface TopProductItem {
  id: string;
  name: string;
  img: string;
  sold: number;
  revenue: number;
}

export interface RegionItem {
  name: string;
  count: number;
  percentage: number;
}

export interface OrderStatusItem {
  status: string;
  label: string;
  color: string;
  count: number;
  percentage: number;
}

export interface AnalyticsData {
  period: {
    months: number;
    startDate: string;
    endDate: string;
  };
  kpi: {
    current: AnalyticsKPI;
    previous: AnalyticsKPI;
    delta: AnalyticsKPIDelta;
  };
  monthlyRevenue: MonthlyRevenueItem[];
  topProducts: TopProductItem[];
  regions: RegionItem[];
  orderStatuses: OrderStatusItem[];
}

export interface AnalyticsResponse {
  success: boolean;
  status: number;
  message: string;
  data: AnalyticsData;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsApiService {
  constructor(private api: ApiService) {}

  getStats(months: number = 6, lang: string = 'vi'): Observable<AnalyticsResponse> {
    return this.api.get<AnalyticsResponse>(`/admin/stats?months=${months}&lang=${lang}`);
  }
}
