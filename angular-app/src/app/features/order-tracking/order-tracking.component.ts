import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LangService } from '../../core/services/lang.service';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div class="text-center space-y-2">
        <h1 class="text-3xl font-serif font-bold text-gray-900">Tra Cứu Tiến Độ Giao Hoa (Angular)</h1>
        <p class="text-sm text-gray-500">Nhập mã đơn hàng hoặc số điện thoại để kiểm tra trạng thái</p>
      </div>

      <div class="bg-white p-4 sm:p-6 rounded-3xl border border-rose-100 shadow-sm">
        <div class="flex flex-col sm:flex-row gap-3">
          <input type="text" [(ngModel)]="orderCode" placeholder="Nhập mã đơn hàng (VD: #HTSG-98234)" class="flex-1 px-4 py-3 bg-rose-50/50 border border-rose-200 rounded-xl text-sm font-semibold focus:outline-none">
          <button (click)="searchOrder()" class="px-6 py-3 bg-[#7A2838] hover:bg-[#5C2129] text-white font-bold rounded-xl text-sm shadow transition-colors flex items-center justify-center gap-2">
            <i class="ri-search-2-line"></i>
            <span>Tra Cứu</span>
          </button>
        </div>
      </div>

      <div *ngIf="orderFound" class="bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-sm space-y-8">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-rose-100 pb-6 gap-4">
          <div>
            <span class="px-3 py-1 bg-rose-100 text-[#7A2838] text-xs font-bold rounded-full">Đơn hàng {{ orderCode }}</span>
            <h2 class="text-xl font-serif font-bold text-gray-900 mt-2">Người Nhận: Nguyễn Thùy Linh</h2>
            <p class="text-xs text-gray-500 mt-0.5"><i class="ri-map-pin-line text-[#7A2838]"></i> Tầng 12, Tòa nhà Bitexco, Q.1, TP.HCM</p>
          </div>
          <div class="text-left sm:text-right">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Đang Giao Hàng
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-[#7A2838] text-white flex items-center justify-center font-bold text-sm shadow"><i class="ri-check-line text-lg"></i></div>
            <div>
              <h4 class="font-bold text-sm text-gray-900">1. Đã Tiếp Nhận</h4>
              <p class="text-xs text-gray-500">09:15</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-[#7A2838] text-white flex items-center justify-center font-bold text-sm shadow"><i class="ri-check-line text-lg"></i></div>
            <div>
              <h4 class="font-bold text-sm text-gray-900">2. Chọn Hoa Tươi</h4>
              <p class="text-xs text-gray-500">09:30</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-[#7A2838] text-white flex items-center justify-center font-bold text-sm shadow"><i class="ri-check-line text-lg"></i></div>
            <div>
              <h4 class="font-bold text-sm text-gray-900">3. Nghệ Nhân Cắm Hoa</h4>
              <p class="text-xs text-gray-500">10:10</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow animate-bounce"><i class="ri-truck-line text-lg"></i></div>
            <div>
              <h4 class="font-bold text-sm text-emerald-600">4. Đang Giao</h4>
              <p class="text-xs text-gray-500">10:45</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  `
})
export class OrderTrackingComponent {
  langService = inject(LangService);
  orderCode = '#HTSG-98234';
  orderFound = true;

  searchOrder() {
    this.orderFound = true;
  }
}
