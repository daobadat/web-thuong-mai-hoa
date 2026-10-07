import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductApiService } from '../../core/services/product-api.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  products: any[] = [];
  editId: number | null = null;
  showAdd = false;
  
  newProd = {
    nameVi: '',
    nameKo: '',
    category: 'Bó hoa',
    price: '',
    stock: '',
    img: ''
  };

  categories = ['Bó hoa', 'Hộp hoa', 'Giỏ hoa', 'Kệ hoa'];

  constructor(private productApi: ProductApiService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productApi.getProducts({ limit: 100 }).subscribe({
      next: (res) => {
        this.products = (res.data?.products || []).map((p: any) => ({
          ...p,
          nameVi: p.translations?.find((t: any) => t.language_code === 'vi')?.name || p.sku,
          nameKo: p.translations?.find((t: any) => t.language_code === 'ko')?.name || '',
          category: p.category?.slug || 'Bó hoa',
          price: p.base_price,
          stock: p.stock_quantity,
          sold: 0,
          img: p.images?.[0]?.url || 'https://images.unsplash.com/photo-1680563094046-5d846e2c59d1?w=200&h=200&fit=crop',
          active: p.is_active !== false
        }));
      }
    });
  }

  get activeProductsCount() {
    return this.products.filter(p => p.active).length;
  }

  toggleAdd() {
    this.showAdd = !this.showAdd;
  }

  toggleActive(id: number) {
    const p = this.products.find(x => x.id === id);
    if (p) {
      this.productApi.updateProduct(id, { is_active: !p.active }).subscribe({
        next: () => p.active = !p.active
      });
    }
  }

  setEditId(id: number) {
    this.editId = this.editId === id ? null : id;
  }

  saveEditString(id: number, field: string, value: string) {
    const p = this.products.find(x => x.id === id);
    if (!p) return;
    p[field] = value;
    
    const payload: any = {};
    if (field === 'nameVi' || field === 'nameKo') {
       payload.translations = [
         { language_code: 'vi', name: p.nameVi },
         { language_code: 'ko', name: p.nameKo }
       ];
    }
    
    this.productApi.updateProduct(id, payload).subscribe();
  }

  saveEditNumber(id: number, field: string, value: string) {
    const p = this.products.find(x => x.id === id);
    if (!p) return;
    p[field] = Number(value);
    
    const payload: any = {};
    if (field === 'price') payload.base_price = Number(value);
    if (field === 'stock') payload.stock_quantity = Number(value);
    
    this.productApi.updateProduct(id, payload).subscribe();
  }

  addProduct() {
    if (!this.newProd.nameVi || !this.newProd.price) return;
    
    const payload = {
      sku: 'SKU-' + Date.now(),
      base_price: Number(this.newProd.price),
      stock_quantity: Number(this.newProd.stock),
      is_active: true,
      translations: [
        { language_code: 'vi', name: this.newProd.nameVi },
        { language_code: 'ko', name: this.newProd.nameKo }
      ]
    };
    
    this.productApi.createProduct(payload).subscribe({
      next: () => {
        this.showAdd = false;
        this.newProd = { nameVi: '', nameKo: '', category: 'Bó hoa', price: '', stock: '', img: '' };
        this.loadProducts();
      },
      error: (err) => alert(err.message)
    });
  }

  cancelAdd() {
    this.showAdd = false;
  }

  deleteProduct(id: number) {
    if(confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      this.productApi.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (err) => alert(err.message)
      });
    }
  }

  fmt(n: number) {
    return new Intl.NumberFormat('vi-VN').format(n);
  }
}
