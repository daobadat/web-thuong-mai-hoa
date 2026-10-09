import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password-page.component.html'
})
export class ResetPasswordPageComponent implements OnInit {
  token = '';
  password = '';
  confirmPassword = '';
  
  loading = false;
  successMsg = '';
  errorMsg = '';
  showPassword = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      if (!this.token) {
        this.errorMsg = 'Liên kết không hợp lệ. Vui lòng yêu cầu lại link đặt lại mật khẩu.';
      }
    });
  }

  onSubmit(e: Event) {
    e.preventDefault();
    if (!this.token) {
      this.errorMsg = 'Liên kết không hợp lệ hoặc đã hết hạn.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMsg = 'Mật khẩu xác nhận không khớp.';
      return;
    }
    if (this.password.length < 6) {
      this.errorMsg = 'Mật khẩu phải có ít nhất 6 ký tự.';
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    
    this.api.post('/auth/reset-password', { token: this.token, password: this.password }).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.successMsg = 'Đổi mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.';
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Có lỗi xảy ra hoặc token đã hết hạn.';
      }
    });
  }
}
