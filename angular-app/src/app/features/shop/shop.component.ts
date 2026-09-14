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
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-serif font-bold text-gray-900">{{ langService.t.shopTitle }}</h1>
          <p class="text-xs text-gray-500 mt-1">Khám phá các bộ sưu tập hoa tươi mới cắt cành</p>
        </div>

        <!-- Filter Occasions Pill Bar -->
        <div class="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            (click)="setOccasion('all')"
            [class.bg-[#7A2838]]="productService.selectedOccasion() === 'all'"
            [class.text-white]="productService.selectedOccasion() === 'all'"
            [class.bg-white]="productService.selectedOccasion() !== 'all'"
            [class.text-gray-700]="productService.selectedOccasion() !== 'all'"
            class="px-4 py-2 rounded-full text-xs font-bold shadow-sm border border-rose-100 transition-all whitespace-nowrap"
          >
            {{ langService.t.filterAll }}
          </button>
          <button
            (click)="setOccasion('sale')"
            [class.bg-[#7A2838]]="productService.selectedOccasion() === 'sale'"
            [class.text-white]="productService.selectedOccasion() === 'sale'"
            [class.bg-white]="productService.selectedOccasion() !== 'sale'"
            [class.text-gray-700]="productService.selectedOccasion() !== 'sale'"
            class="px-4 py-2 rounded-full text-xs font-bold shadow-sm border border-rose-100 transition-all whitespace-nowrap"
          >
            🔥 {{ langService.t.navSale }}
          </button>
          <button
            *ngFor="let k of occasions"
            (click)="setOccasion(k)"
            [class.bg-[#7A2838]]="productService.selectedOccasion() === k"
            [class.text-white]="productService.selectedOccasion() === k"
            [class.bg-white]="productService.selectedOccasion() !== k"
            [class.text-gray-700]="productService.selectedOccasion() !== k"
            class="px-4 py-2 rounded-full text-xs font-bold shadow-sm border border-rose-100 transition-all whitespace-nowrap"
          >
            {{ getOccasionTitle(k) }}
          </button>
        </div>
      </div>

      <!-- Categories Tabs -->
      <div class="flex items-center gap-4 border-b border-rose-100 pb-4 text-xs font-bold">
        <button
          (click)="setCategory('all')"
          [class.text-[#7A2838]]="productService.selectedCategory() === 'all'"
          [class.border-b-2]="productService.selectedCategory() === 'all'"
          [class.border-[#7A2838]]="productService.selectedCategory() === 'all'"
          class="pb-2 text-gray-500 hover:text-gray-900"
        >
          {{ langService.t.filterAll }}
        </button>
        <button
          *ngFor="let cat of ['bouquet', 'box', 'basket', 'stand']"
          (click)="setCategory(cat)"
          [class.text-[#7A2838]]="productService.selectedCategory() === cat"
          [class.border-b-2]="productService.selectedCategory() === cat"
          [class.border-[#7A2838]]="productService.selectedCategory() === cat"
          class="pb-2 text-gray-500 hover:text-gray-900"
        >
          {{ getCategoryName(cat) }}
        </button>
      </div>

      <!-- Products Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          *ngFor="let p of productService.filteredProducts()"
          class="bg-white rounded-2xl overflow-hidden border border-rose-100 shadow-sm hover:shadow-xl transition-all flex flex-col group"
        >
          <div class="relative overflow-hidden aspect-[4/5]">
            <img [src]="p.img" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" [alt]="p.nameVi">
            <span *ngIf="p.isNew" class="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              {{ langService.t.badge.new }}
            </span>
            <span *ngIf="p.isPopular" class="absolute top-3 left-3 bg-[#7A2838] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              {{ langService.t.badge.popular }}
            </span>
          </div>
          <div class="p-5 flex flex-col flex-1">
            <a [routerLink]="['/product', p.id]" class="font-bold text-gray-900 hover:text-[#7A2838] font-serif text-base line-clamp-1">
              {{ langService.currentLang() === 'ko' ? p.nameKo : p.nameVi }}
            </a>
            <p class="text-xs text-gray-500 mt-1 line-clamp-2">
              {{ langService.currentLang() === 'ko' ? p.descKo : p.descVi }}
            </p>
            <div class="mt-auto pt-4 flex items-center justify-between">
              <div>
                <span class="text-[#7A2838] font-bold text-lg">
                  {{ p.price | currencyVnd:(langService.currentLang() === 'ko') }}
                </span>
                <span *ngIf="p.originalPrice" class="block text-xs text-gray-400 line-through">
                  {{ p.originalPrice | currencyVnd:(langService.currentLang() === 'ko') }}
                </span>
              </div>
              <button
                (click)="cartService.addToCart(p)"
                class="px-4 py-2 bg-rose-50 hover:bg-[#7A2838] text-[#7A2838] hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <i class="ri-shopping-bag-line"></i>
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

  occasions: OccasionKey[] = ['birthday', 'opening', 'wedding', 'corporate', 'chuseok', 'valentine'];

  setOccasion(occ: any) {
    this.productService.selectedOccasion.set(occ);
  }

  setCategory(cat: any) {
    this.productService.selectedCategory.set(cat);
  }

  getOccasionTitle(k: OccasionKey) {
    const titles: Record<OccasionKey, string> = {
      birthday: 'Hoa Sinh Nhật',
      opening: 'Hoa Khai Trương',
      wedding: 'Hoa Cưới Hỏi',
      corporate: 'Quà Doanh Nghiệp',
      chuseok: 'Hoa Chuseok',
      valentine: 'Valentine'
    };
    return titles[k] || k;
  }

  getCategoryName(cat: string) {
    const map: Record<string, string> = {
      bouquet: 'Bó hoa',
      box: 'Hộp hoa',
      basket: 'Giỏ hoa',
      stand: 'Kệ hoa'
    };
    return map[cat] || cat;
  }
}
