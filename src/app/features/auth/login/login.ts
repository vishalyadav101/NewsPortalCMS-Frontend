import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);

  userName = '';
  password = '';

  isLoading = false;
  errorMessage = '';

  login(): void {
    this.errorMessage = '';

    if (!this.userName.trim() || !this.password) {
      this.errorMessage = 'Username and password are required.';
      return;
    }

    this.isLoading = true;

    this.authService
      .login({
        userName: this.userName,
        password: this.password,
      })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;

          if (error.status === 401) {
            this.errorMessage = 'Invalid username or password.';
          } else {
            this.errorMessage = 'Login failed. Please try again.';
          }
        },
      });
  }
}
