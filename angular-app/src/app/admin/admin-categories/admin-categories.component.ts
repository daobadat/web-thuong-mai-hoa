import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryApiService } from '../../core/services/category-api.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.css']
})
export class AdminCategoriesComponent implements OnInit {
  categories: any[] = [];
  editId: any = null;
  showAdd = false;
  
  newCategory = {
    name: '',
    slug: '',
    display_order: 0,
    is_active: true
  };

  constructor(private categoryApi: CategoryApiService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryApi.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res.data || [];
      },
      error: (err) => console.error(err)
    });
  }

  get activeCount() {
    return this.categories.filter(c => c.is_active).length;
  }

  toggleAdd() {
    this.showAdd = !this.showAdd;
  }

  toggleActive(id: any) {
    const c = this.categories.find(x => x.id === id);
    if (c) {
      this.categoryApi.updateCategory(id, { is_active: !c.is_active }).subscribe({
        next: () => {
          c.is_active = !c.is_active;
        }
      });
    }
  }

  setEditId(id: any) {
    this.editId = this.editId === id ? null : id;
  }

  saveEditString(id: any, field: string, value: string) {
    const c = this.categories.find((x: any) => x.id === id);
    if (!c) return;
    
    const payload: any = {};
    if (field === 'name') {
        payload.name = value;
    }
    if (field === 'slug') {
        payload.slug = value;
    }
    
    this.categoryApi.updateCategory(id, payload).subscribe();
  }

  addCategory() {
    if (!this.newCategory.name || !this.newCategory.slug) return;
    
    const payload = {
      name: this.newCategory.name,
      slug: this.newCategory.slug,
      display_order: this.newCategory.display_order,
      is_active: this.newCategory.is_active,
      language_code: 'vi'
    };
    
    this.categoryApi.createCategory(payload).subscribe({
      next: () => {
        this.showAdd = false;
        this.newCategory = { name: '', slug: '', display_order: 0, is_active: true };
        this.loadCategories();
      },
      error: (err) => alert(err.message || 'Lỗi khi thêm')
    });
  }

  cancelAdd() {
    this.showAdd = false;
  }

  deleteCategory(id: any) {
    if(confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      this.categoryApi.deleteCategory(id).subscribe({
        next: () => this.loadCategories(),
        error: (err) => alert(err.message)
      });
    }
  }
}
