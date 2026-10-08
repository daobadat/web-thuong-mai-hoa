import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LangService } from '../../core/services/lang.service';
import { CartService } from '../../core/services/cart.service';
import { OrderApiService } from '../../core/services/order-api.service';
import { AuthApiService } from '../../core/services/auth-api.service';
import { CurrencyVndPipe } from '../../shared/pipes/currency-vnd.pipe';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyVndPipe],
  template: `
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 class="text-3xl font-serif font-bold text-gray-900">{{ langService.t.checkout.title }}</h1>

      <form (submit)="placeOrder($event)" class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Details Form -->
        <div class="lg:col-span-7 bg-white p-6 rounded-3xl border border-rose-100 shadow-sm space-y-4">
          <div class="space-y-4 text-sm">
            <div>
              <label class="block font-semibold text-gray-700 mb-1">{{ langService.t.checkout.name }} *</label>
              <input type="text" [(ngModel)]="name" name="name" required class="w-full px-4 py-2.5 bg-rose-50/40 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:outline-none">
            </div>

            <div>
              <label class="block font-semibold text-gray-700 mb-1">{{ langService.t.checkout.phone }} *</label>
              <input type="tel" [(ngModel)]="phone" name="phone" required class="w-full px-4 py-2.5 bg-rose-50/40 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:outline-none">
            </div>

            <div>
              <label class="block font-semibold text-gray-700 mb-1">{{ langService.t.checkout.address }} *</label>
              <input type="text" [(ngModel)]="address" name="address" required class="w-full px-4 py-2.5 bg-rose-50/40 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:outline-none">
            </div>

            <div>
              <label class="block font-semibold text-gray-700 mb-1">Phương thức thanh toán *</label>
              <select [(ngModel)]="paymentMethod" name="paymentMethod" required class="w-full px-4 py-2.5 bg-rose-50/40 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:outline-none">
                <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                <option value="bank_transfer">Chuyển khoản ngân hàng</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-gray-700 mb-1">{{ langService.t.checkout.message }}</label>
              <textarea [(ngModel)]="cardMessage" name="cardMessage" rows="3" [placeholder]="langService.t.checkout.messageHint" class="w-full px-4 py-2.5 bg-rose-50/40 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:outline-none"></textarea>
            </div>
            
            <div *ngIf="errorMessage" class="text-red-500 font-semibold">{{ errorMessage }}</div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-5 space-y-6">
          <div class="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm space-y-6">
            <h3 class="font-bold text-gray-900 font-serif text-lg border-b border-rose-100 pb-3">
              {{ langService.t.orderSummary }}
            </h3>

            <div class="space-y-3">
              <div *ngFor="let item of cartService.cartItems()" class="flex items-center gap-3">
                <img [src]="item.product.img" class="w-12 h-12 rounded-lg object-cover">
                <div class="flex-1 min-w-0">
                  <h4 class="text-xs font-bold text-gray-800 truncate">
                    {{ langService.currentLang() === 'ko' ? item.product.nameKo : item.product.nameVi }}
                  </h4>
                  <p class="text-xs text-gray-500">Số lượng: {{ item.qty }}</p>
                </div>
                <span class="text-sm font-bold text-[#7A2838]">
                  {{ (item.product.price * item.qty) | currencyVnd:(langService.currentLang() === 'ko') }}
                </span>
              </div>
            </div>

            <div class="space-y-2 text-xs border-t border-rose-100 pt-4">
              <div class="flex justify-between text-base font-bold text-gray-900 border-t border-rose-100 pt-3">
                <span>{{ langService.t.cart.total }}</span>
                <span class="text-2xl font-serif text-[#7A2838]">
                  {{ cartService.subtotal() | currencyVnd:(langService.currentLang() === 'ko') }}
                </span>
              </div>
            </div>

            <button type="submit" [disabled]="isSubmitting || cartService.cartItems().length === 0" class="w-full py-4 bg-[#7A2838] hover:bg-[#5C2129] disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg transition-all">
              {{ isSubmitting ? 'Đang xử lý...' : langService.t.checkout.confirm }}
            </button>
          </div>
        </div>

      </form>
    </main>
  `
})
export class CheckoutComponent implements OnInit {
  langService = inject(LangService);
  cartService = inject(CartService);
  orderApi = inject(OrderApiService);
  authApi = inject(AuthApiService);
  router = inject(Router);

  name = '';
  phone = '';
  address = '';
  cardMessage = '';
  paymentMethod: 'cod' | 'bank_transfer' = 'cod';
  
  isSubmitting = false;
  errorMessage = '';

  ngOnInit() {
    const user = this.authApi.currentUser();
    if (user) {
      this.name = user.full_name || '';
      this.phone = user.phone || '';
    }
  }

  placeOrder(e: Event) {
    e.preventDefault();
    if (this.cartService.cartItems().length === 0) {
      this.errorMessage = this.langService.currentLang() === 'vi' ? 'Giỏ hàng trống!' : '장바구니가 비어 있습니다!';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.orderApi.checkout({
      recipient_name: this.name,
      recipient_phone: this.phone,
      delivery_address: this.address,
      card_message: this.cardMessage,
      payment_method: this.paymentMethod
    }).subscribe({
      next: (res) => {
        alert(this.langService.t.checkout.successMsg);
        this.cartService.clearCart();
        this.router.navigate(['/order-tracking']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.message || 'Có lỗi xảy ra khi đặt hàng';
      }
    });
  }
}
