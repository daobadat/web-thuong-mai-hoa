import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  standalone: false
})
export class LoginPageComponent {
  router = inject(Router);
  email = '';
  password = '';

  onLogin(e: Event) {
    e.preventDefault();
    this.router.navigate(['/']);
  }
}
