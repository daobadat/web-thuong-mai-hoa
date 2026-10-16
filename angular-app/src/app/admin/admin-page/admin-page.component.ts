import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { OrderApiService } from '../../core/services/order-api.service';
import { AuthApiService } from '../../core/services/auth-api.service';
import { LangService } from '../../core/services/lang.service';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit, OnDestroy {
  collapsed = false;
  newOrdersCount = 0;
  private intervalId: any;

  navItems = [
    { id: 'dashboard', icon: 'dashboard', link: '/admin/dashboard' },
    { id: 'orders', icon: 'orders', link: '/admin/orders' },
    { id: 'products', icon: 'products', link: '/admin/products' },
    { id: 'categories', icon: 'categories', link: '/admin/categories' },
    { id: 'customers', icon: 'customers', link: '/admin/customers' },
    { id: 'analytics', icon: 'analytics', link: '/admin/analytics' },
    { id: 'settings', icon: 'settings', link: '/admin/settings' },
  ];

  constructor(
    private orderApi: OrderApiService,
    public authApi: AuthApiService,
    public langService: LangService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkNewOrders();
    // Poll new orders count every 30 seconds
    this.intervalId = setInterval(() => {
      this.checkNewOrders();
    }, 30000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  get t() {
    return this.langService.t.admin;
  }

  getNavLabel(id: string): string {
    const nav = this.langService.t.admin.nav;
    return (nav as any)[id] || id;
  }

  toggleLanguage() {
    this.langService.toggleLang();
  }

  checkNewOrders() {
    this.orderApi.getAllOrders({ limit: 50 }).subscribe({
      next: (res: any) => {
        const raw = res.data?.orders || res.data?.data || (Array.isArray(res.data) ? res.data : []);
        this.newOrdersCount = raw.filter((o: any) => o.status === 'pending').length;
      },
      error: () => {}
    });
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  logout() {
    this.authApi.logout();
    this.router.navigate(['/auth/login']);
  }
}
