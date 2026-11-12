import { Component, inject, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApiService } from '../../core/services/auth-api.service';

declare const google: any;

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
  standalone: false
})
export class RegisterPageComponent implements OnInit, AfterViewInit {
  router = inject(Router);
  authApi = inject(AuthApiService);
  ngZone = inject(NgZone);

  name = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  
  showPassword = false;
  
  loading = false;
  errorMsg = '';
  googleClientId = '';

  fieldErrors: {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  } = {};

  clearFieldError(field: 'name' | 'email' | 'phone' | 'password' | 'confirmPassword') {
    if (this.fieldErrors[field]) {
      delete this.fieldErrors[field];
    }
    if (Object.keys(this.fieldErrors).length === 0) {
      this.errorMsg = '';
    }
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.initGoogleAuth();
  }

  initGoogleAuth() {
    this.authApi.getGoogleClientId().subscribe({
      next: (res) => {
        const clientId = res.data?.clientId;
        if (clientId) {
          this.googleClientId = clientId;
          this.renderGoogleButton(clientId);
        }
      },
      error: () => {}
    });
  }

  renderGoogleButton(clientId: string) {
    const checkGoogleInterval = setInterval(() => {
      if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        clearInterval(checkGoogleInterval);
        try {
          google.accounts.id.initialize({
            client_id: clientId,
            callback: (response: any) => {
              this.ngZone.run(() => {
                this.handleGoogleCredential(response);
              });
            }
          });

          const btnContainer = document.getElementById('google-register-btn-container');
          if (btnContainer) {
            const containerWidth = btnContainer.parentElement?.clientWidth || window.innerWidth - 64;
            const buttonWidth = Math.min(380, Math.max(220, Math.floor(containerWidth)));
            google.accounts.id.renderButton(btnContainer, {
              theme: 'outline',
              size: 'large',
              width: buttonWidth,
              text: 'signup_with',
              shape: 'pill'
            });
          }
        } catch (e) {
          console.warn('Google Sign-Up init error:', e);
        }
      }
    }, 200);

    setTimeout(() => clearInterval(checkGoogleInterval), 5000);
  }

  handleGoogleCredential(response: any) {
    if (!response || !response.credential) return;

    this.loading = true;
    this.errorMsg = '';

    this.authApi.loginWithGoogle(response.credential).subscribe({
      next: () => {
        this.loading = false;
        window.location.href = '/';
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Đăng ký bằng Google thất bại. Vui lòng thử lại!';
      }
    });
  }


  onGoogleClick() {
    if (!this.googleClientId) {
      alert('⚠️ Chưa cấu hình GOOGLE_CLIENT_ID trong file .env trên server!\n\nVui lòng lấy Client ID từ Google Cloud Console (https://console.cloud.google.com/apis/credentials) rồi điền vào biến GOOGLE_CLIENT_ID trong file .env nhé.');
      return;
    }

    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
      google.accounts.id.prompt();
    }
  }

  onRegister(e: Event) {
    e.preventDefault();
    this.errorMsg = '';
    this.fieldErrors = {};

    let hasError = false;

    // Validate Họ & Tên
    if (!this.name || !this.name.trim()) {
      this.fieldErrors.name = 'Vui lòng nhập họ & tên.';
      hasError = true;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email || !this.email.trim()) {
      this.fieldErrors.email = 'Vui lòng nhập email.';
      hasError = true;
    } else if (!emailRegex.test(this.email.trim())) {
      this.fieldErrors.email = 'Email không hợp lệ (ví dụ: email@gmail.com).';
      hasError = true;
    }

    // Validate Số điện thoại (nếu có nhập)
    if (this.phone && this.phone.trim()) {
      const cleanPhone = this.phone.replace(/[\s.-]/g, '');
      if (!/^0\d{9,10}$/.test(cleanPhone)) {
        this.fieldErrors.phone = 'Số điện thoại không hợp lệ (cần 10 chữ số, bắt đầu bằng 0).';
        hasError = true;
      }
    }

    // Validate Mật khẩu
    const hasMinLen = this.password.length >= 8;
    const hasLower = /[a-z]/.test(this.password);
    const hasUpper = /[A-Z]/.test(this.password);
    const hasDigit = /\d/.test(this.password);
    const hasSpecial = /[^A-Za-z0-9]/.test(this.password);

    if (!this.password) {
      this.fieldErrors.password = 'Vui lòng nhập mật khẩu.';
      hasError = true;
    } else if (!hasMinLen || !hasLower || !hasUpper || !hasDigit || !hasSpecial) {
      this.fieldErrors.password = 'Mật khẩu phải dài ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.';
      hasError = true;
    }

    // Validate Xác nhận mật khẩu
    if (!this.confirmPassword) {
      this.fieldErrors.confirmPassword = 'Vui lòng xác nhận lại mật khẩu.';
      hasError = true;
    } else if (this.password !== this.confirmPassword) {
      this.fieldErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
      hasError = true;
    }

    if (hasError) {
      this.errorMsg = 'Vui lòng kiểm tra lại các trường thông tin được đánh dấu đỏ bên dưới.';
      return;
    }

    this.loading = true;
    this.authApi.register({
      full_name: this.name.trim(),
      email: this.email.trim(),
      phone: this.phone ? this.phone.trim() : undefined,
      password: this.password
    }).subscribe({
      next: () => {
        this.loading = false;
        window.location.href = '/';
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error?.message || err.message || '';
        if (msg.toLowerCase().includes('email') || msg.toLowerCase().includes('already') || msg.toLowerCase().includes('tồn tại')) {
          this.fieldErrors.email = 'Email này đã được sử dụng. Vui lòng chọn email khác.';
          this.errorMsg = 'Email đã tồn tại trong hệ thống. Vui lòng đăng nhập hoặc dùng email khác.';
        } else if (err.status === 0) {
          this.errorMsg = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra xem server backend đã được khởi động chưa!';
        } else {
          this.errorMsg = msg || 'Đăng ký thất bại. Vui lòng thử lại!';
        }
      }
    });
  }
}
