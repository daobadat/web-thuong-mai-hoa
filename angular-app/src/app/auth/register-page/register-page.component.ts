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
            google.accounts.id.renderButton(btnContainer, {
              theme: 'outline',
              size: 'large',
              width: 380,
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
        this.router.navigate(['/']);
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
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.message || 'Đăng ký thất bại. Email có thể đã tồn tại.';
      }
    });
  }
}
