import { Component, OnInit, HostListener } from '@angular/core';
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
  showAdd = false;
  
  // Filter & Search
  activeTab: 'all' | 'sale' | 'low_stock' = 'all';
  searchKeyword = '';

  // Dropdown states
  showNewOccDropdown = false;
  showEditOccDropdown = false;

  // Edit Modal State
  showEditModal = false;
  isSavingEdit = false;
  editingProd: any = null;

  // Toast feedback
  toastMessage: string | null = null;
  private toastTimeout: any = null;

  newProd = {
    nameVi: '',
    nameKo: '',
    category: '',
    price: '',
    originalPrice: '',
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
          category: p.category?.slug || (this.categoriesList[0]?.slug || 'bo-hoa'),
          occasions: p.occasions?.map((o: any) => o.slug) || [],
          price: Number(p.base_price),
          originalPrice: p.original_price ? Number(p.original_price) : null,
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

  get saleProductsCount() {
    return this.products.filter(p => p.originalPrice && p.originalPrice > p.price).length;
  }

  get lowStockProductsCount() {
    return this.products.filter(p => p.stock <= 5).length;
  }

  get displayedProducts() {
    let list = this.products;

    if (this.activeTab === 'sale') {
      list = list.filter(p => p.originalPrice && p.originalPrice > p.price);
    } else if (this.activeTab === 'low_stock') {
      list = list.filter(p => p.stock <= 5);
    }

    if (this.searchKeyword.trim()) {
      const q = this.searchKeyword.toLowerCase().trim();
      list = list.filter(p => 
        (p.nameVi && p.nameVi.toLowerCase().includes(q)) ||
        (p.nameKo && p.nameKo.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q))
      );
    }

    return list;
  }

  getDiscountPercent(price: number, originalPrice: number | null | undefined): number {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  toggleAdd() {
    this.showAdd = !this.showAdd;
  }

  toggleActive(id: number) {
    const p = this.products.find(x => x.id === id);
    if (p) {
      this.productApi.updateProduct(id, { is_active: !p.active }).subscribe({
        next: () => {
          p.active = !p.active;
          this.showToast(`Đã ${p.active ? 'bật bán' : 'tắt bán'} "${p.nameVi}"`);
        }
      });
    }
  }

  // --- Modal Edit Logic ---
  openEditModal(p: any) {
    this.editingProd = {
      id: p.id,
      sku: p.sku,
      nameVi: p.nameVi || '',
      nameKo: p.nameKo || '',
      category: p.category || (this.categoriesList[0]?.slug || ''),
      price: p.price,
      originalPrice: p.originalPrice || '',
      stock: p.stock !== undefined ? p.stock : 0,
      img: p.img || '',
      occasions: p.occasions ? [...p.occasions] : [],
      active: p.active !== false
    };
    this.showEditModal = true;
    this.showEditOccDropdown = false;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingProd = null;
    this.showEditOccDropdown = false;
  }

  toggleEditOccasion(slug: string) {
    if (!this.editingProd) return;
    if (this.editingProd.occasions.includes(slug)) {
      this.editingProd.occasions = this.editingProd.occasions.filter((s: string) => s !== slug);
    } else {
      this.editingProd.occasions.push(slug);
    }
  }

  toggleEditOccDropdown(event: Event) {
    event.stopPropagation();
    this.showEditOccDropdown = !this.showEditOccDropdown;
    this.showNewOccDropdown = false;
  }

  saveEditProduct() {
    if (!this.editingProd) return;
    if (!this.editingProd.nameVi?.trim()) {
      alert('Vui lòng nhập tên sản phẩm tiếng Việt');
      return;
    }
    if (!this.editingProd.price || Number(this.editingProd.price) <= 0) {
      alert('Vui lòng nhập giá bán hợp lệ');
      return;
    }

    const cat = this.categoriesList.find(c => c.slug === this.editingProd.category);
    const catId = cat ? cat.id : undefined;

    const occIds = this.editingProd.occasions.map((s: string) => {
      const occ = this.occasionsList.find(c => c.slug === s);
      return occ ? occ.id : null;
    }).filter((x: any) => x);

    const origPrice = this.editingProd.originalPrice && Number(this.editingProd.originalPrice) > 0 
      ? Number(this.editingProd.originalPrice) 
      : null;

    const payload: any = {
      base_price: Number(this.editingProd.price),
      original_price: origPrice,
      stock_quantity: this.editingProd.stock !== '' ? Number(this.editingProd.stock) : 0,
      is_active: this.editingProd.active,
      category_id: catId,
      occasion_ids: occIds,
      translations: [
        { language_code: 'vi', name: this.editingProd.nameVi.trim() },
        { language_code: 'ko', name: this.editingProd.nameKo?.trim() || '' }
      ],
      images: this.editingProd.img?.trim() ? [{ url: this.editingProd.img.trim(), is_primary: true }] : []
    };

    this.isSavingEdit = true;
    this.productApi.updateProduct(this.editingProd.id, payload).subscribe({
      next: () => {
        this.isSavingEdit = false;
        this.closeEditModal();
        this.loadProducts();
        this.showToast('Đã lưu thay đổi sản phẩm thành công!');
      },
      error: (err) => {
        this.isSavingEdit = false;
        alert('Lỗi cập nhật sản phẩm: ' + (err.error?.message || err.message));
      }
    });
  }

  quickSetSale(p: any) {
    const currentOrig = p.originalPrice || Math.round(p.price * 1.25);
    const input = prompt(`Nhập giá gốc trước giảm (VND) cho "${p.nameVi}":\n(Giá bán hiện tại: ${this.fmt(p.price)}đ. Nhập 0 để huỷ giảm giá)`, currentOrig.toString());
    if (input !== null) {
      const cleaned = input.trim().replace(/[^0-9]/g, '');
      const val = parseFloat(cleaned);
      const newOrig = isNaN(val) || val <= 0 ? null : val;
      this.productApi.updateProduct(p.id, { original_price: newOrig }).subscribe({
        next: () => {
          p.originalPrice = newOrig;
          this.showToast(newOrig ? `Đã cài giảm giá cho "${p.nameVi}"` : `Đã huỷ giảm giá "${p.nameVi}"`);
        }
      });
    }
  }

  toggleNewProdOccasion(slug: string) {
    if (this.newProd.occasions.includes(slug)) {
      this.newProd.occasions = this.newProd.occasions.filter(s => s !== slug);
    } else {
      this.newProd.occasions.push(slug);
    }
  }

  toggleNewOccDropdown(event: Event) {
    event.stopPropagation();
    this.showNewOccDropdown = !this.showNewOccDropdown;
    this.showEditOccDropdown = false;
  }

  @HostListener('document:click')
  closeDropdowns() {
    this.showNewOccDropdown = false;
    this.showEditOccDropdown = false;
  }

  getOccasionNames(slugs: string[]): string {
    if (!slugs || slugs.length === 0) return 'Chọn dịp tặng...';
    const names = slugs.map(s => this.getOccasionDisplayName(s));
    if (names.length <= 2) return names.join(', ');
    return `${names.slice(0, 2).join(', ')} (+${names.length - 2})`;
  }

  getOccasionDisplayName(slug: string): string {
    const occ = this.occasionsList.find(o => o.slug === slug);
    return occ?.translations?.[0]?.name || occ?.name || slug;
  }

  getCategoryDisplayName(slug: string): string {
    const cat = this.categoriesList.find(c => c.slug === slug);
    return cat?.translations?.[0]?.name || cat?.name || slug;
  }

  showToast(msg: string) {
    this.toastMessage = msg;
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toastMessage = null;
    }, 3500);
  }

  addProduct() {
    if (!this.newProd.nameVi || !this.newProd.price) {
      alert('Vui lòng nhập tên và giá bán');
      return;
    }
    
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
      original_price: this.newProd.originalPrice && Number(this.newProd.originalPrice) > 0 ? Number(this.newProd.originalPrice) : null,
      stock_quantity: this.newProd.stock ? Number(this.newProd.stock) : 0,
      is_active: true,
      translations: [
        { language_code: 'vi', name: this.newProd.nameVi.trim() },
        { language_code: 'ko', name: this.newProd.nameKo.trim() }
      ],
      images: this.newProd.img ? [{ url: this.newProd.img.trim(), is_primary: true }] : []
    };
    
    this.productApi.createProduct(payload).subscribe({
      next: () => {
        this.showAdd = false;
        this.newProd = { nameVi: '', nameKo: '', category: this.categoriesList[0]?.slug || '', price: '', originalPrice: '', stock: '', img: '', occasions: [] };
        this.loadProducts();
        this.showToast('Thêm sản phẩm mới thành công!');
      },
      error: (err) => alert(err.message)
    });
  }

  cancelAdd() {
    this.showAdd = false;
  }

  deleteProduct(id: number) {
    const p = this.products.find(x => x.id === id);
    const name = p ? `"${p.nameVi}"` : 'sản phẩm này';
    if(confirm(`Bạn có chắc chắn muốn xóa ${name}?`)) {
      this.productApi.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
          this.showToast(`Đã xóa ${name}`);
        },
        error: (err) => alert(err.message)
      });
    }
  }

  fmt(n: number) {
    return new Intl.NumberFormat('vi-VN').format(n || 0);
  }
}
