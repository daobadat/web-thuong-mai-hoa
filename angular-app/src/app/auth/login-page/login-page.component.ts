import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApiService } from '../../core/services/auth-api.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  standalone: false
})
export class LoginPageComponent {
  router = inject(Router);
  authApi = inject(AuthApiService);

  email = '';
  password = '';
  showPassword = false;
  loading = false;
  errorMsg = '';

  onLogin(e: Event) {
    e.preventDefault();
    if (!this.email || !this.password) {
      this.errorMsg = 'Vui lòng nhập email và mật khẩu.';
      return;
    }
    this.loading = true;
    this.errorMsg = '';
    this.authApi.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        // Generic error message to prevent account enumeration/brute force info gathering
        this.errorMsg = 'Thông tin đăng nhập không chính xác hoặc tài khoản đã bị khóa.';
      }
    });
  }
}

