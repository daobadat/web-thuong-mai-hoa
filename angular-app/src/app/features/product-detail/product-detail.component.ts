import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LangService } from '../../core/services/lang.service';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { CurrencyVndPipe } from '../../shared/pipes/currency-vnd.pipe';
import { Product } from '../../core/models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyVndPipe],
  template: `
    <main *ngIf="product" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <nav class="flex items-center gap-2 text-xs text-gray-500">
        <a routerLink="/" class="hover:text-[#7A2838]">Trang chủ</a>
        <i class="ri-arrow-right-s-line"></i>
        <a routerLink="/shop" class="hover:text-[#7A2838]">Sản phẩm</a>
        <i class="ri-arrow-right-s-line"></i>
        <span class="text-[#7A2838] font-semibold">
          {{ langService.currentLang() === 'ko' ? product.nameKo : product.nameVi }}
        </span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-white p-6 sm:p-10 rounded-3xl border border-rose-100 shadow-sm">
        <div class="lg:col-span-6 space-y-4">
          <div class="aspect-[4/5] rounded-2xl overflow-hidden border border-rose-100 shadow-md">
            <img [src]="product.img" [alt]="product.nameVi" class="w-full h-full object-cover">
          </div>
        </div>

        <div class="lg:col-span-6 space-y-6">
          <div>
            <h1 class="text-3xl font-serif font-bold text-gray-900 leading-tight">
              {{ langService.currentLang() === 'ko' ? product.nameKo : product.nameVi }}
            </h1>
            <p class="text-sm text-gray-500 mt-2">
              {{ langService.currentLang() === 'ko' ? product.descKo : product.descVi }}
            </p>
          </div>

          <div class="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 flex items-baseline gap-4">
            <span class="text-3xl font-bold text-[#7A2838]">
              {{ product.price | currencyVnd:(langService.currentLang() === 'ko') }}
            </span>
            <span *ngIf="product.originalPrice" class="text-gray-400 line-through text-lg">
              {{ product.originalPrice | currencyVnd:(langService.currentLang() === 'ko') }}
            </span>
          </div>

          <div *ngIf="product.meaningVi" class="bg-gradient-to-r from-rose-50 to-pink-50 p-4 rounded-2xl border border-rose-100 space-y-1">
            <h4 class="text-xs font-bold uppercase tracking-wider text-[#7A2838] flex items-center gap-1">
              <i class="ri-heart-line"></i> {{ langService.t.meaning }}
            </h4>
            <p class="text-xs text-gray-700 italic">
              "{{ langService.currentLang() === 'ko' ? product.meaningKo : product.meaningVi }}"
            </p>
          </div>

          <div class="flex items-center gap-4 pt-2">
            <div class="flex items-center border border-rose-200 rounded-xl bg-white p-1">
              <button (click)="qty = qty > 1 ? qty - 1 : 1" class="w-9 h-9 flex items-center justify-center font-bold text-gray-600">-</button>
              <span class="w-12 text-center text-sm font-bold text-gray-800">{{ qty }}</span>
              <button (click)="qty = qty + 1" class="w-9 h-9 flex items-center justify-center font-bold text-gray-600">+</button>
            </div>
            <button
              (click)="cartService.addToCart(product, qty)"
              class="flex-1 py-3.5 bg-[#7A2838] hover:bg-[#5C2129] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <i class="ri-shopping-bag-3-line text-xl"></i>
              <span>{{ langService.t.addCart }}</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  `
})
export class ProductDetailComponent implements OnInit {
  langService = inject(LangService);
  cartService = inject(CartService);
  productService = inject(ProductService);
  route = inject(ActivatedRoute);

  product?: Product;
  qty = 1;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.product = this.productService.products().find(p => p.id === id) || this.productService.products()[0];
    });
  }
}
