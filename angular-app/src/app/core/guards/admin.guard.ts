import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthApiService } from '../services/auth-api.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  authApi = inject(AuthApiService);
  router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authApi.isLoggedIn() && this.authApi.isAdmin()) {
      return true;
    }
    
    this.router.navigate(['/']);
    return false;
  }
}
