import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApiService } from '../../core/services/auth-api.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
  standalone: false
})
export class RegisterPageComponent {
  router = inject(Router);
  authApi = inject(AuthApiService);

  name = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  
  showPassword = false;
  
  loading = false;
  errorMsg = '';

  onRegister(e: Event) {
    e.preventDefault();
    this.errorMsg = '';

    if (!this.name || !this.email || !this.password) {
      this.errorMsg = 'Vui lòng nhập đầy đủ các trường bắt buộc.';
      return;
    }

    // Password strength check (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(this.password)) {
      this.errorMsg = 'Mật khẩu phải dài ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMsg = 'Mật khẩu xác nhận không khớp.';
      return;
    }

    this.loading = true;
    this.authApi.register({
      full_name: this.name,
      email: this.email,
      phone: this.phone,
      password: this.password
    }).subscribe({
      next: () => {
        this.loading = false;
        // Backend trả về access_token luôn nên user đã logged in
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.message || 'Đăng ký thất bại. Email có thể đã tồn tại.';
      }
    });
  }
}
