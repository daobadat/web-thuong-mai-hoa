import { Component, OnInit, OnDestroy, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AnalyticsApiService, AnalyticsData, MonthlyRevenueItem } from '../../core/services/analytics-api.service';
import { LangService } from '../../core/services/lang.service';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-analytics.component.html',
  styleUrls: ['./admin-analytics.component.css']
})
export class AdminAnalyticsComponent implements OnInit, OnDestroy {
  langService = inject(LangService);
  private analyticsApi = inject(AnalyticsApiService);

  selectedMonths: number = 6;
  loading: boolean = true;
  error: boolean = false;
  data: AnalyticsData | null = null;
  hoveredMonth: MonthlyRevenueItem | null = null;

  maxRev: number = 1;
  maxSold: number = 1;
  hasRevenueData: boolean = false;

  private sub?: Subscription;

  constructor() {
    // Re-fetch automatically when user toggles language
    effect(() => {
      const _ = this.langService.currentLang();
      this.loadData();
    });
  }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  get t() {
    return this.langService.t.analytics;
  }

  get currentYear(): number {
    return new Date().getFullYear();
  }

  setMonths(months: number) {
    if (this.selectedMonths === months) return;
    this.selectedMonths = months;
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.error = false;
    if (this.sub) this.sub.unsubscribe();

    this.sub = this.analyticsApi
      .getStats(this.selectedMonths, this.langService.currentLang())
      .subscribe({
        next: (res) => {
          this.data = res.data;
          this.loading = false;
          this.error = false;

          const revenues = this.data?.monthlyRevenue?.map((m) => m.revenue) || [];
          this.maxRev = Math.max(...revenues, 1);
          this.hasRevenueData = revenues.some((r) => r > 0);

          const solds = this.data?.topProducts?.map((p) => p.sold) || [];
          this.maxSold = Math.max(...solds, 1);
        },
        error: (err) => {
          console.error('[AdminAnalytics] Load error:', err);
          this.loading = false;
          this.error = true;
        },
      });
  }

  fmt(amount: number | null | undefined): string {
    if (amount == null) return '0đ';
    const isKo = this.langService.currentLang() === 'ko';
    const num = new Intl.NumberFormat(isKo ? 'ko-KR' : 'vi-VN').format(Math.round(amount));
    return `${num}${isKo ? '원' : 'đ'}`;
  }

  fmtShort(amount: number): string {
    if (!amount) return '0';
    if (amount >= 1_000_000) {
      return (amount / 1_000_000).toFixed(1).replace('.0', '') + 'M';
    }
    if (amount >= 1_000) {
      return (amount / 1_000).toFixed(0) + 'K';
    }
    return amount.toString();
  }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    const fallback =
      'https://images.unsplash.com/photo-1680563094046-5d846e2c59d1?w=200&h=200&fit=crop';
    if (img && img.src !== fallback) {
      img.src = fallback;
    }
  }

  getBarHeightPct(rev: number): string {
    if (!this.maxRev || rev <= 0) return '4px';
    const pct = Math.max(Math.round((rev / this.maxRev) * 100), 4);
    return `${pct}%`;
  }
}
