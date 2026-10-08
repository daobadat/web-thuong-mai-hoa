import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductApiService } from '../../core/services/product-api.service';
import { CategoryApiService } from '../../core/services/category-api.service';
import { OccasionApiService } from '../../core/services/occasion-api.service';

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
    category: '',
    price: '',
    stock: '',
    img: '',
    occasions: [] as string[]
  };

  categoriesList: any[] = [];
  occasionsList: any[] = [];

  constructor(
    private productApi: ProductApiService,
    private categoryApi: CategoryApiService,
    private occasionApi: OccasionApiService
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadOccasions();
    this.loadProducts();
  }

  loadOccasions() {
    this.occasionApi.getOccasions().subscribe({
      next: (res: any) => {
        this.occasionsList = res.data || [];
      }
    });
  }

  loadCategories() {
    this.categoryApi.getCategories().subscribe({
      next: (res: any) => {
        this.categoriesList = res.data || [];
        if (this.categoriesList.length > 0 && !this.newProd.category) {
          this.newProd.category = this.categoriesList[0].slug;
        }
      }
    });
  }

  loadProducts() {
    this.productApi.getProducts({ limit: 100 }).subscribe({
      next: (res) => {
        this.products = (res.data?.products || []).map((p: any) => ({
          ...p,
          nameVi: p.translations?.find((t: any) => t.language_code === 'vi')?.name || p.sku,
          nameKo: p.translations?.find((t: any) => t.language_code === 'ko')?.name || '',
          category: p.category?.slug || 'Bó hoa',
          occasions: p.occasions?.map((o: any) => o.slug) || [],
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

  saveEditCategory(id: number, slug: string) {
    const p = this.products.find(x => x.id === id);
    if (!p) return;
    p.category = slug;
    
    const cat = this.categoriesList.find(c => c.slug === slug);
    if (!cat) return;
    
    const payload = { category_id: cat.id };
    this.productApi.updateProduct(id, payload).subscribe();
  }

  saveEditOccasion(id: number, slug: string) {
    const p = this.products.find(x => x.id === id);
    if (!p) return;
    
    if (p.occasions.includes(slug)) {
      p.occasions = p.occasions.filter((s: string) => s !== slug);
    } else {
      p.occasions.push(slug);
    }
    
    const payload = { occasion_ids: p.occasions.map((s: string) => {
      const occ = this.occasionsList.find(c => c.slug === s);
      return occ ? occ.id : null;
    }).filter((x: any) => x) };
    
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

  toggleNewProdOccasion(slug: string) {
    if (this.newProd.occasions.includes(slug)) {
      this.newProd.occasions = this.newProd.occasions.filter(s => s !== slug);
    } else {
      this.newProd.occasions.push(slug);
    }
  }

  addProduct() {
    if (!this.newProd.nameVi || !this.newProd.price) return;
    
    const cat = this.categoriesList.find(c => c.slug === this.newProd.category);
    if (!cat) {
      alert('Vui lòng chọn danh mục hợp lệ');
      return;
    }
    
    const payload = {
      sku: 'SKU-' + Date.now(),
      category_id: cat.id,
      occasion_ids: this.newProd.occasions.map((s: string) => {
        const occ = this.occasionsList.find(c => c.slug === s);
        return occ ? occ.id : null;
      }).filter((x: any) => x),
      base_price: Number(this.newProd.price),
      stock_quantity: Number(this.newProd.stock),
      is_active: true,
      translations: [
        { language_code: 'vi', name: this.newProd.nameVi },
        { language_code: 'ko', name: this.newProd.nameKo }
      ],
      images: this.newProd.img ? [{ url: this.newProd.img, is_primary: true }] : []
    };
    
    this.productApi.createProduct(payload).subscribe({
      next: () => {
        this.showAdd = false;
        this.newProd = { nameVi: '', nameKo: '', category: this.categoriesList[0]?.slug || '', price: '', stock: '', img: '', occasions: [] };
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
