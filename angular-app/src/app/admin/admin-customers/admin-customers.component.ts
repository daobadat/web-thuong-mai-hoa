import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ADMIN_CUSTOMERS } from '../admin-data';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-customers.component.html',
  styleUrls: ['./admin-customers.component.css']
})
export class AdminCustomersComponent {
  customers = [...ADMIN_CUSTOMERS];
  search = '';

  get filteredCustomers() {
    const q = this.search.toLowerCase();
    return this.customers.filter(c => !q || c.name.toLowerCase().includes(q) || c.phone.includes(q));
  }

  get totalKorean() {
    return this.customers.filter(c => c.lang === 'ko').length;
  }

  get totalRevenue() {
    return this.customers.reduce((s, c) => s + c.totalSpent, 0);
  }

  fmt(n: number) {
    return new Intl.NumberFormat('vi-VN').format(n);
  }
}
