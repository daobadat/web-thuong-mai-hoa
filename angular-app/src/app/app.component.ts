import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
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
  private router = inject(Router);

  get isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }
}
