import { Component } from '@angular/core';

@Component({
  selector: 'app-breaking-news',
  standalone: true,
  templateUrl: './breaking-news.html',
  styleUrl: './breaking-news.css',
})
export class BreakingNews {
  breakingNews = [
    'AI technology is transforming industries across the world',
    'Latest technology updates and important developments',
    'NewsPortal brings you the latest breaking news',
  ];
}
