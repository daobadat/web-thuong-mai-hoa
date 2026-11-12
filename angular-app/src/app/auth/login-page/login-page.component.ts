import { Component, inject, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthApiService } from '../../core/services/auth-api.service';

declare const google: any;

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  standalone: false
})
export class LoginPageComponent implements OnInit, AfterViewInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  authApi = inject(AuthApiService);
  ngZone = inject(NgZone);

  email = '';
  password = '';
  showPassword = false;
  loading = false;
  errorMsg = '';
  returnUrl = '/';
  googleClientId = '';

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

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

          const btnContainer = document.getElementById('google-btn-container');
          if (btnContainer) {
            const containerWidth = btnContainer.parentElement?.clientWidth || window.innerWidth - 64;
            const buttonWidth = Math.min(380, Math.max(220, Math.floor(containerWidth)));
            google.accounts.id.renderButton(btnContainer, {
              theme: 'outline',
              size: 'large',
              width: buttonWidth,
              text: 'continue_with',
              shape: 'pill'
            });
          }
        } catch (e) {
          console.warn('Google Sign-In init error:', e);
        }
      }
    }, 200);

    // Timeout sau 5 giây nếu không load được script
    setTimeout(() => clearInterval(checkGoogleInterval), 5000);
  }

  handleGoogleCredential(response: any) {
    if (!response || !response.credential) return;

    this.loading = true;
    this.errorMsg = '';

    this.authApi.loginWithGoogle(response.credential).subscribe({
      next: () => {
        this.loading = false;
        const target = (this.returnUrl && !this.returnUrl.startsWith('/auth')) ? this.returnUrl : '/';
        if (this.authApi.isAdmin()) {
          window.location.href = '/admin';
        } else {
          window.location.href = target;
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Đăng nhập Google thất bại. Vui lòng thử lại!';
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
        const target = (this.returnUrl && !this.returnUrl.startsWith('/auth')) ? this.returnUrl : '/';
        if (this.authApi.isAdmin()) {
          window.location.href = '/admin';
        } else {
          window.location.href = target;
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = 'Thông tin đăng nhập không chính xác hoặc tài khoản đã bị khóa.';
      }
    });
  }
}
