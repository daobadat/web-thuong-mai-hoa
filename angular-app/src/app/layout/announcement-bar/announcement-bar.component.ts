import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LangService } from '../../core/services/lang.service';

@Component({
  selector: 'app-announcement-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-[#6E2A34] text-[#FBF6EF] text-xs py-2 px-4 text-center font-medium tracking-wide shadow-inner flex items-center justify-between">
      <div class="max-w-7xl mx-auto flex items-center justify-between w-full">
        <p class="flex items-center gap-2 text-center sm:text-left w-full justify-center sm:justify-start">
          <span>🌸</span>
          <span>{{ langService.t.announce }}</span>
        </p>
        <div class="hidden lg:flex items-center gap-4 text-[11px] whitespace-nowrap opacity-90">
          <a href="#" class="hover:underline flex items-center gap-1">
            <i class="ri-truck-line"></i> Tra cứu đơn hàng
          </a>
          <span>|</span>
          <span>Hỗ trợ song ngữ VI / KR</span>
        </div>
      </div>
    </div>
  `
})
export class AnnouncementBarComponent {
  langService = inject(LangService);
}
