import { Component, inject } from '@angular/core';
import { LangService } from '../../core/services/lang.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
  standalone: false
})
export class CartPageComponent {
  langService = inject(LangService);
  cartService = inject(CartService);
}
