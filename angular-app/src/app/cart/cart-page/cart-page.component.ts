import { Component, inject } from '@angular/core';
import { LangService } from '../../core/services/lang.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
  standalone: false
})
export class CartPageComponent {
  langService = inject(LangService);
  cartService = inject(CartService);

  couponCode = '';
  discountAmount = 0;
  couponApplied = false;
  couponMsg = '';

  get vi(): boolean {
    return this.langService.currentLang() === 'vi';
  }

  getProductName(p: Product): string {
    return this.vi ? p.nameVi : p.nameKo;
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
    return this.subtotal + this.vat + this.shipping - this.discountAmount;
  }

  get isFreeship(): boolean {
    return this.subtotal >= 800000;
  }

  get amountToFreeship(): number {
    return Math.max(0, 800000 - this.subtotal);
  }

  applyCoupon() {
    if (this.couponCode.trim().toUpperCase() === 'HOATUOI') {
      this.discountAmount = Math.round(this.subtotal * 0.05);
      this.couponApplied = true;
      this.couponMsg = this.vi ? '✓ Mã áp dụng thành công (Giảm 5%)!' : '✓ 쿠폰 적용 성공 (5% 할인)!';
    } else {
      this.discountAmount = 0;
      this.couponApplied = false;
      this.couponMsg = this.vi ? '✕ Mã không hợp lệ' : '✕ 유효하지 않은 쿠폰';
    }
  }

  clearCart() {
    if (confirm(this.vi ? 'Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?' : '장바구니를 모두 비우시겠습니까?')) {
      this.cartService.clearCart();
    }
  }

  updateNote(productId: number, note: string) {
    const item = this.cartService.cartItems().find(i => i.product.id === productId);
    if (item) {
      this.cartService.updateItemNote(productId, note);
    }
  }
}
