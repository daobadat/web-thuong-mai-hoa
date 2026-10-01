import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LangService } from '../../core/services/lang.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css'],
  standalone: false
})
export class CheckoutPageComponent implements OnInit {
  langService = inject(LangService);
  cartService = inject(CartService);
  router = inject(Router);

  name = 'Nguyễn Thùy Linh';
  phone = '0908 123 456';
  address = 'Tầng 12, Tòa nhà Bitexco, Q.1, TP.HCM';
  deliveryDate = '';
  deliveryTime = '08:00-12:00';
  cardMessage = 'Chúc mừng sinh nhật em yêu!';
  paymentMethod = 'cod';
  
  isSuccess = false;

  get vi(): boolean {
    return this.langService.currentLang() === 'vi';
  }

  ngOnInit() {
    const today = new Date();
    this.deliveryDate = today.toISOString().split('T')[0];
    if (this.cartService.cartItems().length === 0 && !this.isSuccess) {
      this.router.navigate(['/cart']);
    }
  }

  formatPrice(n: number): string {
    return new Intl.NumberFormat('vi-VN').format(n);
  }

  get subtotal(): number {
    return this.cartService.subtotal();
  }

  get vat(): number {
    return Math.round(this.subtotal * 0.08); // 8% VAT
  }

  get shipping(): number {
    return this.subtotal >= 800000 ? 0 : 35000;
  }

  get total(): number {
    return this.subtotal + this.vat + this.shipping; // Simplified without coupon for checkout view
  }

  placeOrder(e: Event) {
    e.preventDefault();
    if (!this.name || !this.phone || !this.address || !this.deliveryDate) {
      alert(this.vi ? 'Vui lòng điền đầy đủ thông tin bắt buộc!' : '필수 정보를 모두 입력해주세요!');
      return;
    }
    
    // Simulate order placement
    this.isSuccess = true;
    this.cartService.clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
