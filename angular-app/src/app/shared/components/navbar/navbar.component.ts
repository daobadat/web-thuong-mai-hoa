import { Component, inject, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { LangService } from '../../../core/services/lang.service';
import { CartService } from '../../../core/services/cart.service';
import { ProductService } from '../../../core/services/product.service';
import { AuthApiService } from '../../../core/services/auth-api.service';
import { OccasionKey } from '../../../core/models';

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
  authApi = inject(AuthApiService);
  router = inject(Router);

  menuOpen = false;
  userOpen = false;
  searchVal = '';

  get occasionKeys(): string[] {
    return this.productService.occasionKeys();
  }

  @HostListener('window:keydown.escape')
  onEscape() {
    this.userOpen = false;
    this.menuOpen = false;
  }

  getAvatarLetter(): string {
    const name = this.authApi.currentUser()?.full_name?.trim();
    if (!name) return 'U';
    const words = name.split(/\s+/);
    const lastWord = words[words.length - 1];
    return lastWord.charAt(0).toUpperCase();
  }

  toggleLang() {
    const nextLang = this.langService.currentLang() === 'vi' ? 'ko' : 'vi';
    this.langService.setLang(nextLang);
  }

  getOccasionName(key: string): string {
    return this.productService.getOccasionName(key, this.langService.currentLang());
  }

  getOccasionIcon(key: string): string {
    return this.productService.getOccasionIcon(key);
  }

  filterOccasion(key: OccasionKey | 'sale') {
    this.productService.selectedOccasion.set(key);
    this.router.navigate(['/shop']);
  }

  onSearch(query: string) {
    this.productService.searchQuery.set(query);
    this.router.navigate(['/shop']);
  }

  logout() {
    this.authApi.logout();
    this.userOpen = false;
    this.router.navigate(['/']);
  }
}

