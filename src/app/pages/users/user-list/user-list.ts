import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
// import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly userService = inject(UserService);

  users: User[] = [];

  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getAll().subscribe({
      next: (response) => {
        this.users = response;
        this.isLoading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error(error);
        this.errorMessage = 'Unable to load users.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  toggleStatus(user: User): void {
    this.userService
      .updateStatus(user.id, {
        isActive: !user.isActive,
      })
      .subscribe({
        next: () => {
          user.isActive = !user.isActive;
        },

        error: (error) => {
          console.error(error);
          alert('Unable to update user status.');
        },
      });
  }

  deleteUser(id: number): void {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    this.userService.delete(id).subscribe({
      next: () => {
        this.users = this.users.filter((x) => x.id !== id);
      },

      error: (error) => {
        console.error(error);
        alert('Unable to delete user.');
      },
    });
  }
}
