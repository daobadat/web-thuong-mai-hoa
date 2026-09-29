import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 max-w-3xl">
      <h1 class="font-serif text-3xl text-[#2C1A2E]">Cài đặt</h1>

      <div class="bg-white rounded-2xl border border-[#EDE5DF] p-5">
        <h3 class="font-medium text-[#2C1A2E] mb-4">Thông tin cửa hàng</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ng-container *ngTemplateOutlet="field; context: {label: 'Tên cửa hàng', k: 'shopName'}"></ng-container>
          <ng-container *ngTemplateOutlet="field; context: {label: 'Số điện thoại', k: 'phone', type: 'tel'}"></ng-container>
          <ng-container *ngTemplateOutlet="field; context: {label: 'KakaoTalk ID', k: 'kakao'}"></ng-container>
          <ng-container *ngTemplateOutlet="field; context: {label: 'Zalo', k: 'zalo'}"></ng-container>
          <div class="sm:col-span-2"><ng-container *ngTemplateOutlet="field; context: {label: 'Địa chỉ Hà Nội', k: 'addressHN'}"></ng-container></div>
          <div class="sm:col-span-2"><ng-container *ngTemplateOutlet="field; context: {label: 'Địa chỉ TP.HCM', k: 'addressHCM'}"></ng-container></div>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-[#EDE5DF] p-5">
        <h3 class="font-medium text-[#2C1A2E] mb-4">Giờ hoạt động & Vận chuyển</h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <ng-container *ngTemplateOutlet="field; context: {label: 'Mở cửa', k: 'openTime', type: 'time'}"></ng-container>
          <ng-container *ngTemplateOutlet="field; context: {label: 'Đóng cửa', k: 'closeTime', type: 'time'}"></ng-container>
          <ng-container *ngTemplateOutlet="field; context: {label: 'Phí ship HN (đ)', k: 'deliveryFeeHN', type: 'number'}"></ng-container>
          <ng-container *ngTemplateOutlet="field; context: {label: 'Phí ship HCM (đ)', k: 'deliveryFeeHCM', type: 'number'}"></ng-container>
          <div class="sm:col-span-2"><ng-container *ngTemplateOutlet="field; context: {label: 'Miễn phí ship từ (đ)', k: 'freeShipFrom', type: 'number'}"></ng-container></div>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-[#EDE5DF] p-5">
        <h3 class="font-medium text-[#2C1A2E] mb-2">Thông báo & Tự động hoá</h3>
        <ng-container *ngTemplateOutlet="toggle; context: {label: 'Thông báo qua Email', desc: 'Gửi email khi có đơn mới', k: 'notifyEmail'}"></ng-container>
        <ng-container *ngTemplateOutlet="toggle; context: {label: 'Thông báo qua Zalo', desc: 'Gửi Zalo khi có đơn mới', k: 'notifyZalo'}"></ng-container>
        <ng-container *ngTemplateOutlet="toggle; context: {label: 'Tự động xác nhận đơn', desc: 'Xác nhận đơn hàng tự động sau 5 phút', k: 'autoConfirm'}"></ng-container>
      </div>

      <button class="px-6 py-3 bg-[#8B4A5C] text-white font-medium rounded-xl hover:bg-[#7A3D4F] transition-colors">
        Lưu thay đổi
      </button>

      <ng-template #field let-label="label" let-k="k" let-type="type">
        <div>
          <label class="text-xs font-medium text-[#7A6870] uppercase tracking-wide">{{ label }}</label>
          <input
            [type]="type || 'text'"
            [(ngModel)]="settings[k]"
            class="mt-1 w-full border border-[#DDD4CC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B4A5C] bg-white"
          />
        </div>
      </ng-template>

      <ng-template #toggle let-label="label" let-desc="desc" let-k="k">
        <div class="flex justify-between items-center py-3 border-b border-[#EDE5DF] last:border-0">
          <div>
            <div class="text-sm font-medium text-[#2C1A2E]">{{ label }}</div>
            <div class="text-xs text-[#7A6870] mt-0.5">{{ desc }}</div>
          </div>
          <button
            (click)="toggleSetting(k)"
            class="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
            [ngClass]="settings[k] ? 'bg-[#7A9E7E]' : 'bg-[#DDD4CC]'"
          >
            <span class="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all"
                  [ngClass]="settings[k] ? 'left-5' : 'left-0.5'"></span>
          </button>
        </div>
      </ng-template>
    </div>
  `
})
export class AdminSettingsComponent {
  settings: Record<string, any> = {
    shopName: 'Hoa Tươi Việt Nam',
    phone: '0901 234 567',
    kakao: 'hoatuoivn',
    zalo: '0901234567',
    addressHN: '24 Xuân Thủy, Cầu Giấy, Hà Nội',
    addressHCM: '88 Lê Lợi, Q.1, TP.HCM',
    openTime: '07:00',
    closeTime: '21:00',
    deliveryFeeHN: '30000',
    deliveryFeeHCM: '40000',
    freeShipFrom: '500000',
    notifyEmail: true,
    notifyZalo: true,
    autoConfirm: false,
  };

  toggleSetting(k: string) {
    this.settings[k] = !this.settings[k];
  }
}
