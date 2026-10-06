import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject } from '@angular/core';
import { LangService } from '../../core/services/lang.service';
import { ApiService } from '../../core/services/api.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-qr-payment',
  templateUrl: './qr-payment.component.html',
  styleUrls: ['./qr-payment.component.css'],
  standalone: false
})
export class QrPaymentComponent implements OnInit, OnDestroy {
  @Input() qrUrl!: string;
  @Input() orderNumber!: string;
  @Input() amount!: number;
  
  @Output() paymentSuccess = new EventEmitter<void>();

  langService = inject(LangService);
  apiService = inject(ApiService);

  private pollSubscription?: Subscription;
  isExpired = false;

  get vi(): boolean {
    return this.langService.currentLang() === 'vi';
  }

  ngOnInit() {
    // Poll trạng thái thanh toán mỗi 3 giây
    this.pollSubscription = interval(3000).subscribe(() => {
      this.checkPaymentStatus();
    });
  }

  ngOnDestroy() {
    if (this.pollSubscription) {
      this.pollSubscription.unsubscribe();
    }
  }

  formatPrice(n: number): string {
    return new Intl.NumberFormat('vi-VN').format(n);
  }

  private checkPaymentStatus() {
    this.apiService.get<{ success: boolean; data: { payment_status: string; status: string } }>(`/payments/status/${this.orderNumber}`)
      .subscribe({
        next: (res) => {
          if (res.success && res.data.payment_status === 'paid') {
            if (this.pollSubscription) {
              this.pollSubscription.unsubscribe();
            }
            this.paymentSuccess.emit();
          }
        },
        error: (err) => {
          console.error("Lỗi khi kiểm tra trạng thái thanh toán:", err);
        }
      });
  }
}
