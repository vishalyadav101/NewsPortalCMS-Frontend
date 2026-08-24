import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, RegisterRequest } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor() {
    this.registerForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        userName: ['', Validators.required],
        password: [
  '',
  [
    Validators.required,
    Validators.minLength(6),
    Validators.pattern(/^(?=.*[A-Z]).*$/),
  ],
],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword
      ? null
      : { passwordMismatch: true };
  }

  onRegister(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const data: RegisterRequest = {
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName,
      email: this.registerForm.value.email,
      userName: this.registerForm.value.userName,
      password: this.registerForm.value.password,
      confirmPassword: this.registerForm.value.confirmPassword,
    };

    this.auth.register(data).subscribe({
  next: (response: string) => {
  console.log('Registration successful:', response);

  this.isLoading = false;

  // Reset form
  this.registerForm.reset();

  // Show popup
  alert('Registration successful!');

    // Go to profile photo page AFTER OK
  this.router.navigate(['/login']);

  // Reset validation state
  this.registerForm.markAsPristine();
  this.registerForm.markAsUntouched();
},
     error: (error: any) => {
  console.error('========== REGISTRATION ERROR ==========');
  console.error('Status:', error.status);
  console.error('Status Text:', error.statusText);
  console.error('URL:', error.url);
  console.error('Error:', error.error);
  console.error('Full Error:', error);

  this.isLoading = false;

  if (error.error?.message) {
    this.errorMessage = error.error.message;
  } else if (typeof error.error === 'string') {
    this.errorMessage = error.error;
  } else {
    this.errorMessage =
      'Registration failed. Please check the API response.';
  }
},
    });
  }
}