import { Component, inject } from '@angular/core';
import { LangService } from '../../../core/services/lang.service';
import { CartService } from '../../../core/services/cart.service';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: false
})
export class NavbarComponent {
  langService = inject(LangService);
  cartService = inject(CartService);
  productService = inject(ProductService);
}
