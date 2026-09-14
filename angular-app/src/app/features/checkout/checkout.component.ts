import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LangService } from '../../core/services/lang.service';
import { CartService } from '../../core/services/cart.service';
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
              <label class="block font-semibold text-gray-700 mb-1">{{ langService.t.checkout.message }}</label>
              <textarea [(ngModel)]="cardMessage" name="cardMessage" rows="3" [placeholder]="langService.t.checkout.messageHint" class="w-full px-4 py-2.5 bg-rose-50/40 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:outline-none"></textarea>
            </div>
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

            <button type="submit" class="w-full py-4 bg-[#7A2838] hover:bg-[#5C2129] text-white font-bold rounded-2xl shadow-lg transition-all">
              {{ langService.t.checkout.confirm }}
            </button>
          </div>
        </div>

      </form>
    </main>
  `
})
export class CheckoutComponent {
  langService = inject(LangService);
  cartService = inject(CartService);
  router = inject(Router);

  name = 'Nguyễn Thùy Linh';
  phone = '0908 123 456';
  address = 'Tầng 12, Tòa nhà Bitexco, Q.1, TP.HCM';
  cardMessage = 'Chúc mừng sinh nhật em yêu!';

  placeOrder(e: Event) {
    e.preventDefault();
    alert(this.langService.t.checkout.successMsg);
    this.cartService.clearCart();
    this.router.navigate(['/order-tracking']);
  }
}
