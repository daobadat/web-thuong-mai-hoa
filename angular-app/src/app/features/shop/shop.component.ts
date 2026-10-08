import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LangService } from '../../core/services/lang.service';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { CurrencyVndPipe } from '../../shared/pipes/currency-vnd.pipe';
import { OccasionKey } from '../../core/models';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyVndPipe],
  template: `
    <main class="site-container py-10 space-y-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-serif font-bold text-gray-900">{{ langService.t.shopTitle }}</h1>
          <p class="text-xs text-gray-500 mt-1">
            {{ langService.currentLang() === 'vi' ? 'Khám phá các bộ sưu tập hoa tươi mới cắt cành' : '다양한 신선한 꽃 컬렉션을 살펴보세요' }}
          </p>
        </div>

        <!-- Filter Occasions Pill Bar -->
        <div class="flex items-center gap-2 overflow-x-auto pb-2 flex-wrap">
          <button
            (click)="setOccasion('all')"
            [class.bg-[#6E2A34]]="productService.selectedOccasion() === 'all'"
            [class.text-white]="productService.selectedOccasion() === 'all'"
            [class.bg-white]="productService.selectedOccasion() !== 'all'"
            [class.text-gray-700]="productService.selectedOccasion() !== 'all'"
            class="px-4 py-2 rounded-full text-xs font-bold shadow-sm border border-[#E4D9C8] transition-all whitespace-nowrap hover:bg-[#F4EDE3]"
          >
            {{ langService.t.filterAll }}
          </button>
          <button
            (click)="setOccasion('sale')"
            [class.bg-[#6E2A34]]="productService.selectedOccasion() === 'sale'"
            [class.text-white]="productService.selectedOccasion() === 'sale'"
            [class.bg-white]="productService.selectedOccasion() !== 'sale'"
            [class.text-[#6E2A34]]="productService.selectedOccasion() !== 'sale'"
            class="px-4 py-2 rounded-full text-xs font-bold shadow-sm border border-[#E4D9C8] transition-all whitespace-nowrap hover:bg-[#F4EDE3]"
          >
            🔥 {{ langService.t.navSale }}
          </button>
          <button
            *ngFor="let k of occasionKeys"
            (click)="setOccasion(k)"
            [class.bg-[#6E2A34]]="productService.selectedOccasion() === k"
            [class.text-white]="productService.selectedOccasion() === k"
            [class.bg-white]="productService.selectedOccasion() !== k"
            [class.text-gray-700]="productService.selectedOccasion() !== k"
            class="px-4 py-2 rounded-full text-xs font-bold shadow-sm border border-[#E4D9C8] transition-all whitespace-nowrap hover:bg-[#F4EDE3] flex items-center gap-1"
          >
            <span>{{ getOccasionIcon(k) }}</span>
            {{ getOccasionTitle(k) }}
          </button>
        </div>
      </div>

      <!-- Categories Tabs -->
      <div class="flex items-center gap-6 border-b border-[#E4D9C8] pb-0 text-xs font-bold overflow-x-auto">
        <button
          (click)="setCategory('all')"
          [class.text-[#6E2A34]]="productService.selectedCategory() === 'all'"
          [class.border-[#6E2A34]]="productService.selectedCategory() === 'all'"
          [class.border-b-2]="productService.selectedCategory() === 'all'"
          class="pb-3 text-gray-500 hover:text-gray-900 whitespace-nowrap transition-colors"
        >
          {{ langService.t.filterAll }}
        </button>
        <button
          *ngFor="let slug of productService.CATEGORY_SLUGS"
          (click)="setCategory(slug)"
          [class.text-[#6E2A34]]="productService.selectedCategory() === slug"
          [class.border-[#6E2A34]]="productService.selectedCategory() === slug"
          [class.border-b-2]="productService.selectedCategory() === slug"
          class="pb-3 text-gray-500 hover:text-gray-900 whitespace-nowrap transition-colors"
        >
          {{ productService.getCategoryName(slug, langService.currentLang()) }}
        </button>
      </div>

      <!-- Products Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div *ngIf="productService.filteredProducts().length === 0" class="col-span-full text-center py-16 text-gray-400">
          <span class="text-5xl block mb-4">🌸</span>
          <p class="text-sm">{{ langService.currentLang() === 'vi' ? 'Không tìm thấy sản phẩm phù hợp.' : '해당 상품이 없습니다.' }}</p>
        </div>
        <div
          *ngFor="let p of productService.filteredProducts()"
          class="bg-white rounded-2xl overflow-hidden border border-[#E4D9C8] shadow-sm hover:shadow-xl transition-all flex flex-col group"
        >
          <div class="relative overflow-hidden aspect-[4/5]">
            <img [src]="p.img" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" [alt]="p.nameVi">
            <span *ngIf="p.isNew" class="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              {{ langService.t.badge.new }}
            </span>
            <span *ngIf="p.isPopular && !p.isNew" class="absolute top-3 left-3 bg-[#6E2A34] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              {{ langService.t.badge.popular }}
            </span>
          </div>
          <div class="p-5 flex flex-col flex-1">
            <a [routerLink]="['/product', p.id]" class="font-bold text-gray-900 hover:text-[#6E2A34] font-serif text-base line-clamp-1">
              {{ langService.currentLang() === 'ko' ? p.nameKo : p.nameVi }}
            </a>
            <p class="text-xs text-gray-500 mt-1 line-clamp-2">
              {{ langService.currentLang() === 'ko' ? p.descKo : p.descVi }}
            </p>
            <div class="mt-auto pt-4 flex items-center justify-between">
              <div>
                <span class="text-[#6E2A34] font-bold text-lg">
                  {{ p.price | currencyVnd:(langService.currentLang() === 'ko') }}
                </span>
                <span *ngIf="p.originalPrice" class="block text-xs text-gray-400 line-through">
                  {{ p.originalPrice | currencyVnd:(langService.currentLang() === 'ko') }}
                </span>
              </div>
              <button
                (click)="cartService.addToCart(p)"
                class="px-4 py-2 bg-[#F4EDE3] hover:bg-[#6E2A34] text-[#6E2A34] hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                🛒
                <span>{{ langService.t.addCart }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

    </main>
  `
})
export class ShopComponent {
  langService = inject(LangService);
  cartService = inject(CartService);
  productService = inject(ProductService);

  get occasionKeys(): string[] {
    return this.productService.occasionKeys();
  }

  setOccasion(occ: any) {
    this.productService.selectedOccasion.set(occ);
  }

  setCategory(cat: any) {
    this.productService.selectedCategory.set(cat);
  }

  getOccasionIcon(k: string): string {
    return this.productService.getOccasionIcon(k);
  }

  getOccasionTitle(k: string): string {
    return this.productService.getOccasionName(k, this.langService.currentLang());
  }

  getCategoryName(slug: string) {
    return this.productService.getCategoryName(slug, this.langService.currentLang());
  }
}

