import { Component, inject } from '@angular/core';
import { LangService } from '../../core/services/lang.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-custom-bouquet-page',
  templateUrl: './custom-bouquet-page.component.html',
  styleUrls: ['./custom-bouquet-page.component.css'],
  standalone: false
})
export class CustomBouquetPageComponent {
  langService = inject(LangService);
  cartService = inject(CartService);

  flowers = [
    { name: 'Hồng Phấn Đà Lạt', icon: '🌹', price: 350000 },
    { name: 'Tulip Hà Lan', icon: '🌷', price: 450000 },
    { name: 'Hướng Dương', icon: '🌻', price: 280000 }
  ];

  papers = [
    { name: 'Giấy Kraft', price: 30000 },
    { name: 'Lụa Hồng', price: 50000 },
    { name: 'Xám Hàn Quốc', price: 40000 },
    { name: 'Viền Vàng', price: 60000 }
  ];

  selectedFlower = this.flowers[0];
  selectedPaper = this.papers[1];

  get total() {
    return this.selectedFlower.price + this.selectedPaper.price;
  }

  addCustomToCart() {
    const customProduct: any = {
      id: 999,
      nameVi: `Bó Hoa Thiết Kế (${this.selectedFlower.name})`,
      nameKo: `맞춤 꽃다발 (${this.selectedFlower.name})`,
      price: this.total,
      occasions: ['birthday'],
      category: 'bouquet',
      img: 'https://images.unsplash.com/photo-1680563094046-5d846e2c59d1?w=500&h=620&fit=crop&auto=format',
      descVi: `Giấy gói: ${this.selectedPaper.name}`,
      descKo: `포장지: ${this.selectedPaper.name}`,
      stock: 99
    };
    this.cartService.addToCart(customProduct, 1, `Giấy gói: ${this.selectedPaper.name}`);
  }
}
