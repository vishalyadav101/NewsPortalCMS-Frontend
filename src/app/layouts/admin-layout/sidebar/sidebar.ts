import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  userOpen = false;
  newsOpen = true;
  contentOpen = false;
  reportsOpen = false;

  toggleUser() {
    this.userOpen = !this.userOpen;
  }

  toggleNews() {
    this.newsOpen = !this.newsOpen;
  }

  toggleContent() {
    this.contentOpen = !this.contentOpen;
  }

  toggleReports() {
    this.reportsOpen = !this.reportsOpen;
  }
}
