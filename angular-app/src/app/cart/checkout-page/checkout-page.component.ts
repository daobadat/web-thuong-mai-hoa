import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LangService } from '../../core/services/lang.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css'],
  standalone: false
})
export class CheckoutPageComponent {
  langService = inject(LangService);
  cartService = inject(CartService);
  router = inject(Router);

  name = 'Nguyễn Thùy Linh';
  phone = '0908 123 456';
  address = 'Tầng 12, Tòa nhà Bitexco, Q.1, TP.HCM';
  cardMessage = 'Chúc mừng sinh nhật em yêu!';

  placeOrder(e: Event) {
    e.preventDefault();
    alert(this.langService.t.checkout.successMsg);
    this.cartService.clearCart();
    this.router.navigate(['/cart/order-tracking']);
  }
}
