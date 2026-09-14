import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
  standalone: false
})
export class RegisterPageComponent {
  router = inject(Router);
  name = '';
  email = '';
  password = '';

  onRegister(e: Event) {
    e.preventDefault();
    this.router.navigate(['/auth/login']);
  }
}
