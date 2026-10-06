import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { CartItem, Product } from '../models';
import { ToastService } from './toast.service';
import { LangService } from './lang.service';
import { AuthApiService } from './auth-api.service';
import { ApiService } from './api.service';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  toastService = inject(ToastService);
  langService = inject(LangService);
  authApi = inject(AuthApiService);
  api = inject(ApiService);
  productService = inject(ProductService);

  public cartItems = signal<CartItem[]>([]);
  public isCartOpen = signal<boolean>(false);
  
  constructor() {
    effect(() => {
      // Trigger when user logs in or out
      const user = this.authApi.currentUser();
      this.loadCartFromBackend();
    }, { allowSignalWrites: true });
  }

  public loadCartFromBackend() {
    this.api.get<any>('/cart').subscribe({
      next: (res) => {
        this.syncCartFromBackend(res.data);
      },
      error: (err) => console.error('Failed to load cart', err)
    });
  }

  private syncCartFromBackend(backendCart: any) {
    if (!backendCart || !backendCart.items) {
      this.cartItems.set([]);
      return;
    }
    const products = this.productService.products();
    const currentLocal = this.cartItems();
    
    const newItems: CartItem[] = backendCart.items.map((bItem: any) => {
      const prod = products.find(p => String(p.id) === String(bItem.product_id));
      if (prod) {
        const existing = currentLocal.find(i => String(i.product.id) === String(bItem.product_id));
        return {
          id: bItem.id,
          product: prod,
          qty: bItem.quantity,
          note: existing?.note || ''
        };
      }
      return null;
    }).filter((i: any) => i !== null);
    
    this.cartItems.set(newItems);
  }

  public totalItems = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.qty, 0)
  );

  public subtotal = computed(() =>
    this.cartItems().reduce((sum, item) => sum + (item.product.price * item.qty), 0)
  );

  public toggleCart() {
    this.isCartOpen.set(!this.isCartOpen());
  }

  public addToCart(product: Product, qty: number = 1, note: string = '') {
    this.api.post<any>('/cart/add', { product_id: product.id, quantity: qty }).subscribe({
      next: (res) => {
        this.syncCartFromBackend(res.data);
        
        if (note) {
          this.updateItemNote(String(product.id), note);
        }

        this.isCartOpen.set(true);
        const msg = this.langService.currentLang() === 'vi' ? 'Đã thêm vào giỏ hàng!' : '장바구니에 추가되었습니다!';
        this.toastService.show(msg);
      },
      error: (err) => {
        this.toastService.show('Lỗi: ' + (err.message || 'Không thể thêm vào giỏ'));
      }
    });
  }

  public updateQty(productId: string, delta: number) {
    const current = this.cartItems();
    const item = current.find(i => String(i.product.id) === String(productId));
    if (!item || !item.id) return;
    
    const newQty = item.qty + delta;
    if (newQty <= 0) {
      this.removeItem(productId);
      return;
    }
    
    // Optimistic update
    this.cartItems.set(current.map(i => String(i.product.id) === String(productId) ? { ...i, qty: newQty } : i));
    
    this.api.put<any>(`/cart/items/${item.id}`, { quantity: newQty }).subscribe({
      next: (res) => this.syncCartFromBackend(res.data),
      error: () => this.loadCartFromBackend() // rollback
    });
  }

  public updateItemNote(productId: string, note: string) {
    const updated = this.cartItems().map(item => {
      if (String(item.product.id) === String(productId)) {
        return { ...item, note };
      }
      return item;
    });
    this.cartItems.set(updated);
  }

  public removeItem(productId: string) {
    const current = this.cartItems();
    const item = current.find(i => String(i.product.id) === String(productId));
    if (!item || !item.id) return;

    // Optimistic update
    this.cartItems.set(current.filter(i => String(i.product.id) !== String(productId)));

    this.api.delete<any>(`/cart/items/${item.id}`).subscribe({
      next: (res) => this.syncCartFromBackend(res.data),
      error: () => this.loadCartFromBackend() // rollback
    });
  }

  public clearCart() {
    this.cartItems.set([]);
    // In a full backend implementation, we might call a DELETE /cart endpoint.
    // For now, we manually delete each item.
    const current = this.cartItems();
    current.forEach(item => {
      if (item.id) {
        this.api.delete<any>(`/cart/items/${item.id}`).subscribe();
      }
    });
  }
}
