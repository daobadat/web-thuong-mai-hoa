import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password-page.component.html'
})
export class ForgotPasswordPageComponent {
  email = '';
  loading = false;
  successMsg = '';
  errorMsg = '';

  constructor(private api: ApiService) {}

  onSubmit(e: Event) {
    e.preventDefault();
    if (!this.email) return;

    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    this.api.post('/auth/forgot-password', { email: this.email }).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.successMsg = 'Đã gửi link đặt lại mật khẩu! Vui lòng kiểm tra hộp thư email của bạn.';
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = 'Có lỗi xảy ra, vui lòng thử lại sau.';
      }
    });
  }
}
