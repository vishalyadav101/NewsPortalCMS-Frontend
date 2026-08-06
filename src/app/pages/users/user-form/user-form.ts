import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { UserService } from '../../../core/services/user.service';
import { UpdateUserRequest } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm implements OnInit {
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  userId = 0;

  isLoading = true;
  isSaving = false;

  errorMessage = '';

  user: UpdateUserRequest = {
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    profileImage: null,
    isActive: true,
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.userId = +id;
      this.loadUser();
    }
  }

  loadUser(): void {
    this.userService.getById(this.userId).subscribe({
      next: (response) => {
        this.user = {
          firstName: response.firstName,
          lastName: response.lastName,
          userName: response.userName,
          email: response.email,
          profileImage: response.profileImage,
          isActive: response.isActive,
        };

        this.isLoading = false;
      },

      error: (error) => {
        console.error(error);
        this.errorMessage = 'Unable to load user.';
        this.isLoading = false;
      },
    });
  }

  save(): void {
    this.isSaving = true;

    this.userService.update(this.userId, this.user).subscribe({
      next: () => {
        this.router.navigate(['/users']);
      },

      error: (error) => {
        console.error(error);
        this.errorMessage = 'Unable to update user.';
        this.isSaving = false;
      },
    });
  }
}
