import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  template: `
    <div *ngIf="toastService.isVisible()" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] bg-[#2B2A26] text-white text-sm px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-fade-in-up">
      <span>🌸</span>
      <span>{{ toastService.message() }}</span>
    </div>
  `,
  styles: [`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translate(-50%, 16px); }
      to { opacity: 1; transform: translate(-50%, 0); }
    }
    .animate-fade-in-up { animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  `],
  standalone: false
})
export class ToastComponent {
  toastService = inject(ToastService);
}
