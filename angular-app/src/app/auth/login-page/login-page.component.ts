import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthApiService } from '../../core/services/auth-api.service';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  standalone: false
})
export class LoginPageComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  authApi = inject(AuthApiService);

  email = '';
  password = '';
  showPassword = false;
  loading = false;
  errorMsg = '';
  returnUrl = '/';

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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
        if (this.authApi.isAdmin()) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigateByUrl(this.returnUrl);
        }
      },
      error: (err) => {
        this.loading = false;
        // Generic error message to prevent account enumeration/brute force info gathering
        this.errorMsg = 'Thông tin đăng nhập không chính xác hoặc tài khoản đã bị khóa.';
      }
    });
  }
}

