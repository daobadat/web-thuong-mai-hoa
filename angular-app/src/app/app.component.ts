import { Component, inject } from '@angular/core';
import { CartService } from './core/services/cart.service';
import { LangService } from './core/services/lang.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent {
  cartService = inject(CartService);
  langService = inject(LangService);
}
