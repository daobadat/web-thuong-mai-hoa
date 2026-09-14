import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LangService } from '../../core/services/lang.service';
import { CartService } from '../../core/services/cart.service';
import { CurrencyVndPipe } from '../../shared/pipes/currency-vnd.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyVndPipe],
  template: `
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-serif font-bold text-gray-900">{{ langService.t.cart.title }}</h1>
        <a routerLink="/shop" class="text-xs font-bold text-[#7A2838] hover:underline flex items-center gap-1">
          ← Tiếp tục chọn hoa
        </a>
      </div>

      <div *ngIf="cartService.cartItems().length === 0" class="bg-white p-12 rounded-3xl border border-rose-100 text-center space-y-4">
        <i class="ri-shopping-bag-line text-6xl text-rose-300 block"></i>
        <p class="text-gray-500 text-sm font-medium">{{ langService.t.cart.empty }}</p>
        <a routerLink="/shop" class="inline-block px-6 py-3 bg-[#7A2838] text-white font-bold rounded-2xl text-xs shadow">
          {{ langService.t.cart.emptyAction }}
        </a>
      </div>

      <div *ngIf="cartService.cartItems().length > 0" class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- List Left -->
        <div class="lg:col-span-8 bg-white p-6 rounded-3xl border border-rose-100 shadow-sm space-y-4">
          <div *ngFor="let item of cartService.cartItems()" class="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-rose-50/40 rounded-2xl border border-rose-100 gap-4">
            <div class="flex items-center gap-4">
              <img [src]="item.product.img" class="w-20 h-20 object-cover rounded-xl" [alt]="item.product.nameVi">
              <div>
                <h3 class="font-bold text-gray-900 font-serif text-base">
                  {{ langService.currentLang() === 'ko' ? item.product.nameKo : item.product.nameVi }}
                </h3>
                <p class="text-xs text-[#7A2838] font-bold mt-0.5">
                  {{ item.product.price | currencyVnd:(langService.currentLang() === 'ko') }}
                </p>
              </div>
            </div>

            <div class="flex items-center justify-between sm:justify-end gap-6">
              <div class="flex items-center border border-rose-200 rounded-xl bg-white p-1">
                <button (click)="cartService.updateQty(item.product.id, -1)" class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-rose-50 rounded-lg font-bold">-</button>
                <span class="w-10 text-center text-sm font-bold">{{ item.qty }}</span>
                <button (click)="cartService.updateQty(item.product.id, 1)" class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-rose-50 rounded-lg font-bold">+</button>
              </div>
              <span class="font-bold text-gray-900 text-base">
                {{ (item.product.price * item.qty) | currencyVnd:(langService.currentLang() === 'ko') }}
              </span>
              <button (click)="cartService.removeItem(item.product.id)" class="text-gray-400 hover:text-rose-600 p-2">
                <i class="ri-delete-bin-line text-xl"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Summary Right -->
        <div class="lg:col-span-4 space-y-6">
          <div class="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm space-y-6">
            <h3 class="font-bold text-gray-900 font-serif text-lg border-b border-rose-100 pb-3">
              {{ langService.t.orderSummary }}
            </h3>

            <div class="space-y-3 text-sm">
              <div class="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span class="font-semibold text-gray-900">
                  {{ cartService.subtotal() | currencyVnd:(langService.currentLang() === 'ko') }}
                </span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span class="font-semibold text-emerald-600">Miễn phí</span>
              </div>
              <div class="flex justify-between text-base font-bold text-gray-900 border-t border-rose-100 pt-3">
                <span>{{ langService.t.cart.total }}</span>
                <span class="text-2xl font-serif text-[#7A2838]">
                  {{ cartService.subtotal() | currencyVnd:(langService.currentLang() === 'ko') }}
                </span>
              </div>
            </div>

            <a routerLink="/checkout" class="block w-full py-4 bg-[#7A2838] hover:bg-[#5C2129] text-white font-bold text-center rounded-2xl shadow-lg transition-all">
              {{ langService.t.cart.checkout }}
            </a>
          </div>
        </div>
      </div>
    </main>
  `
})
export class CartComponent {
  langService = inject(LangService);
  cartService = inject(CartService);
}
