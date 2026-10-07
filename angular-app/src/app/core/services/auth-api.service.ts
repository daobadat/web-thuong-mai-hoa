import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';

export enum Role {
  ADMIN = 'admin',
  STAFF = 'staff',
  CUSTOMER = 'customer'
}

export interface AuthUser {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: Role;
  preferred_language?: string;
  avatar_url?: string;
  has_password?: boolean;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: AuthUser;
  };
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  phone?: string;
  preferred_language?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  public currentUser = signal<AuthUser | null>(
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  public isLoggedIn = computed(() => !!this.currentUser());
  public isAdmin = computed(() => this.currentUser()?.role === Role.ADMIN);
  public isStaff = computed(() => 
    this.currentUser()?.role === Role.ADMIN || this.currentUser()?.role === Role.STAFF
  );

  constructor(private api: ApiService) {
    window.addEventListener('storage', (event) => {
      if (event.key === 'user' && !event.newValue) {
        this.api.clearToken();
        this.currentUser.set(null);
      } else if (event.key === 'user' && event.newValue) {
        this.currentUser.set(JSON.parse(event.newValue));
      }
    });
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.api.post<any>('/auth/login', { email, password }).pipe(
      tap((res) => {
        if (res.data?.token) {
          this.api.setToken(res.data.token);
          this.currentUser.set(res.data.user);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
      })
    );
  }

  register(payload: RegisterPayload): Observable<LoginResponse> {
    return this.api.post<any>('/auth/register', payload).pipe(
      tap((res) => {
        if (res.data?.token) {
          this.api.setToken(res.data.token);
          this.currentUser.set(res.data.user);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
      })
    );
  }

  getMe(): Observable<{ success: boolean; data: AuthUser }> {
    return this.api.get<{ success: boolean; data: AuthUser }>('/auth/me').pipe(
      tap((res) => {
        if (res.data) {
          this.currentUser.set(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        }
      })
    );
  }

  logout() {
    this.api.clearToken();
    this.currentUser.set(null);
  }
}
