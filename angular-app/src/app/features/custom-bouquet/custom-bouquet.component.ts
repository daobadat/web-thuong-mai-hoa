import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LangService } from '../../core/services/lang.service';
import { CartService } from '../../core/services/cart.service';
import { CurrencyVndPipe } from '../../shared/pipes/currency-vnd.pipe';

@Component({
  selector: 'app-custom-bouquet',
  standalone: true,
  imports: [CommonModule, CurrencyVndPipe],
  template: `
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div class="text-center max-w-2xl mx-auto space-y-2">
        <span class="px-3 py-1 bg-rose-100 text-[#7A2838] text-xs font-bold rounded-full uppercase tracking-wider">Công Cụ Tương Tác</span>
        <h1 class="text-3xl font-serif font-bold text-gray-900">Tự Tay Phối Bó Hoa Theo Ý Thích</h1>
        <p class="text-sm text-gray-500">Tự chọn loại hoa, giấy gói và phụ kiện. Hệ thống Angular sẽ tự động tính giá tiền!</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-7 space-y-6">
          <div class="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm space-y-4">
            <h3 class="font-bold text-gray-900 font-serif text-lg">1. Chọn Hoa Chủ Đạo</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div
                *ngFor="let f of flowers"
                (click)="selectedFlower = f"
                [class.border-[#7A2838]]="selectedFlower.name === f.name"
                [class.bg-rose-50/50]="selectedFlower.name === f.name"
                class="p-4 rounded-2xl border-2 border-gray-100 hover:border-rose-300 cursor-pointer text-center space-y-1 transition-all"
              >
                <span class="text-3xl block">{{ f.icon }}</span>
                <h4 class="font-bold text-xs text-gray-800">{{ f.name }}</h4>
                <p class="text-[11px] text-[#7A2838] font-bold">{{ f.price | currencyVnd }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm space-y-4">
            <h3 class="font-bold text-gray-900 font-serif text-lg">2. Chọn Giấy Gói</h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                *ngFor="let p of papers"
                (click)="selectedPaper = p"
                [class.border-[#7A2838]]="selectedPaper.name === p.name"
                [class.bg-rose-100]="selectedPaper.name === p.name"
                class="p-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-rose-50"
              >
                {{ p.name }} ({{ p.price | currencyVnd }})
              </button>
            </div>
          </div>
        </div>

        <div class="lg:col-span-5 space-y-6">
          <div class="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm space-y-6 sticky top-24">
            <h3 class="font-bold text-gray-900 font-serif text-lg border-b border-rose-100 pb-3">Xem Trước Thiết Kế</h3>

            <div class="aspect-video bg-gradient-to-tr from-rose-100 to-pink-50 rounded-2xl border border-rose-200 flex items-center justify-center flex-col p-4 text-center">
              <span class="text-6xl mb-2">{{ selectedFlower.icon }}</span>
              <h4 class="font-bold text-gray-800 text-base font-serif">Bó {{ selectedFlower.name }}</h4>
              <p class="text-xs text-[#7A2838] font-medium">Giấy gói: {{ selectedPaper.name }}</p>
            </div>

            <div class="space-y-2 text-xs border-t border-rose-100 pt-4">
              <div class="flex justify-between text-gray-600">
                <span>Hoa chính:</span>
                <span class="font-bold text-gray-900">{{ selectedFlower.price | currencyVnd }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Giấy gói & nơ:</span>
                <span class="font-bold text-gray-900">{{ selectedPaper.price | currencyVnd }}</span>
              </div>
              <div class="flex justify-between text-base font-bold text-gray-900 border-t border-rose-100 pt-3">
                <span>Tổng Tiền Bó Hoa</span>
                <span class="text-2xl font-serif text-[#7A2838]">{{ total | currencyVnd }}</span>
              </div>
            </div>

            <button
              (click)="addCustomToCart()"
              class="w-full py-4 bg-[#7A2838] hover:bg-[#5C2129] text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <i class="ri-shopping-bag-line text-xl"></i>
              <span>Thêm Bó Hoa Này Vào Giỏ</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  `
})
export class CustomBouquetComponent {
  langService = inject(LangService);
  cartService = inject(CartService);

  flowers = [
    { name: 'Hồng Phấn Đà Lạt', icon: '🌹', price: 350000 },
    { name: 'Tulip Hà Lan', icon: '🌷', price: 450000 },
    { name: 'Hướng Dương', icon: '🌻', price: 280000 }
  ];

  papers = [
    { name: 'Giấy Kraft', price: 30000 },
    { name: 'Lụa Hồng', price: 50000 },
    { name: 'Xám Hàn Quốc', price: 40000 },
    { name: 'Viền Vàng', price: 60000 }
  ];

  selectedFlower = this.flowers[0];
  selectedPaper = this.papers[1];

  get total() {
    return this.selectedFlower.price + this.selectedPaper.price;
  }

  addCustomToCart() {
    const customProduct: any = {
      id: 999,
      nameVi: `Bó Hoa Thiết Kế (${this.selectedFlower.name})`,
      nameKo: `맞춤 꽃다발 (${this.selectedFlower.name})`,
      price: this.total,
      occasions: ['birthday'],
      category: 'bouquet',
      img: 'https://images.unsplash.com/photo-1680563094046-5d846e2c59d1?w=500&h=620&fit=crop&auto=format',
      descVi: `Giấy gói: ${this.selectedPaper.name}`,
      descKo: `포장지: ${this.selectedPaper.name}`,
      stock: 99
    };
    this.cartService.addToCart(customProduct, 1, `Giấy gói: ${this.selectedPaper.name}`);
  }
}
