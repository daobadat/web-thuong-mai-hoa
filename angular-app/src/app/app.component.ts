import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from './core/services/cart.service';
import { LangService } from './core/services/lang.service';
import { AuthApiService } from './core/services/auth-api.service';
import { ToastService } from './core/services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent {
  cartService = inject(CartService);
  langService = inject(LangService);
  authService = inject(AuthApiService);
  toastService = inject(ToastService);
  private router = inject(Router);

  get isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }

  proceedToCheckout() {
    this.cartService.toggleCart();
    if (!this.authService.isLoggedIn()) {
      this.toastService.show(this.langService.currentLang() === 'vi' ? 'Xin hãy đăng nhập để đặt hoa' : '꽃을 주문하려면 로그인해 주세요');
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/cart/checkout' } });
      return;
    }
    this.router.navigate(['/cart/checkout']);
  }
}
