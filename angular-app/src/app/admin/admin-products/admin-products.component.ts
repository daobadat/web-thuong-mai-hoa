import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ADMIN_PRODUCTS, AdminProduct } from '../admin-data';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent {
  products = [...ADMIN_PRODUCTS];
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

  get activeProductsCount() {
    return this.products.filter(p => p.active).length;
  }

  toggleAdd() {
    this.showAdd = !this.showAdd;
  }

  toggleActive(id: number) {
    this.products = this.products.map(x => x.id === id ? { ...x, active: !x.active } : x);
  }

  setEditId(id: number) {
    this.editId = this.editId === id ? null : id;
  }

  saveEditString(id: number, field: 'nameVi' | 'nameKo' | 'category' | 'img', value: string) {
    this.products = this.products.map(x => x.id === id ? { ...x, [field]: value } : x);
  }

  saveEditNumber(id: number, field: 'price' | 'stock', value: string) {
    this.products = this.products.map(x => x.id === id ? { ...x, [field]: Number(value) } : x);
  }

  addProduct() {
    if (!this.newProd.nameVi || !this.newProd.price) return;
    const maxId = Math.max(...this.products.map(p => p.id), 0);
    const id = maxId + 1;
    
    this.products = [...this.products, {
      id,
      nameVi: this.newProd.nameVi,
      nameKo: this.newProd.nameKo,
      category: this.newProd.category,
      price: Number(this.newProd.price),
      stock: Number(this.newProd.stock),
      sold: 0,
      img: this.newProd.img || 'https://images.unsplash.com/photo-1680563094046-5d846e2c59d1?w=200&h=200&fit=crop',
      active: true,
    }];
    
    this.showAdd = false;
    this.newProd = { nameVi: '', nameKo: '', category: 'Bó hoa', price: '', stock: '', img: '' };
  }

  cancelAdd() {
    this.showAdd = false;
  }

  fmt(n: number) {
    return new Intl.NumberFormat('vi-VN').format(n);
  }
}
