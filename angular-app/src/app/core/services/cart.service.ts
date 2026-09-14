import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Product } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public cartItems = signal<CartItem[]>([
    {
      product: {
        id: 1, nameVi: 'Bó Hồng Phấn Premium 24 Bông', nameKo: '프리미엄 핑크 장미 24송이',
        price: 850000, originalPrice: 1000000,
        occasions: ['birthday', 'valentine'], category: 'bouquet',
        img: 'https://images.unsplash.com/photo-1680563094046-5d846e2c59d1?w=500&h=620&fit=crop&auto=format',
        descVi: '24 bông hồng phấn Đà Lạt kết hợp baby\'s breath tinh tế.',
        descKo: '달랏산 핑크 장미 24송이, 안개꽃 조합.', stock: 12
      },
      qty: 1,
      note: ''
    }
  ]);

  public isCartOpen = signal<boolean>(false);

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
    const current = this.cartItems();
    const existingIndex = current.findIndex(i => i.product.id === product.id);

    if (existingIndex > -1) {
      const updated = [...current];
      updated[existingIndex] = {
        ...updated[existingIndex],
        qty: updated[existingIndex].qty + qty,
        note: note || updated[existingIndex].note
      };
      this.cartItems.set(updated);
    } else {
      this.cartItems.set([...current, { product, qty, note }]);
    }
    this.isCartOpen.set(true);
  }

  public updateQty(productId: number, delta: number) {
    const current = this.cartItems();
    const updated = current.map(item => {
      if (item.product.id === productId) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter((item): item is CartItem => item !== null);

    this.cartItems.set(updated);
  }

  public removeItem(productId: number) {
    this.cartItems.set(this.cartItems().filter(i => i.product.id !== productId));
  }

  public clearCart() {
    this.cartItems.set([]);
  }
}
