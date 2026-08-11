import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { NewsService } from '../../../core/services/news';
import { TagService } from '../../../core/services/tag';
import { NewsTagService } from '../../../core/services/news-tag';

import { News } from '../../../core/models/news.model';
import { Tag } from '../../../core/models/tag.model';
import { AssignNewsTagRequest } from '../../../core/models/news-tag.model';

@Component({
  selector: 'app-news-tag',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './news-tag.html',
  styleUrl: './news-tag.css',
})
export class NewsTag implements OnInit {
  private readonly newsService = inject(NewsService);
  private readonly tagService = inject(TagService);
  private readonly newsTagService = inject(NewsTagService);
  private readonly cdr = inject(ChangeDetectorRef);

  newsList: News[] = [];
  tagList: Tag[] = [];

  selectedNewsId = 0;
  selectedTagIds: number[] = [];

  isLoading = true;
  isSaving = false;

  errorMessage = '';

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      news: this.newsService.getAll(),
      tags: this.tagService.getAll(),
    }).subscribe({
      next: ({ news, tags }) => {
        this.newsList = news;

        this.tagList = tags.map((tag) => ({
          ...tag,
          selected: false,
        }));

        this.isLoading = false;

        // Force UI update
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('News/Tag loading error:', error);

        this.errorMessage = 'Unable to load news and tags.';
        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  onNewsChange(): void {
    this.selectedTagIds = [];

    // Uncheck all tags first
    this.tagList.forEach((tag) => {
      tag.selected = false;
    });

    this.cdr.detectChanges();

    if (this.selectedNewsId === 0) {
      return;
    }

    this.newsTagService.getByNews(this.selectedNewsId).subscribe({
      next: (data: number[]) => {
        console.log('Selected News:', this.selectedNewsId);
        console.log('Assigned Tags:', data);

        this.selectedTagIds = [...data];

        // Check assigned tags
        this.tagList.forEach((tag) => {
          tag.selected = data.includes(tag.id);
        });

        // Force checkbox UI update
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Get News Tags error:', error);

        this.selectedTagIds = [];

        this.tagList.forEach((tag) => {
          tag.selected = false;
        });

        this.cdr.detectChanges();
      },
    });
  }

  toggleTag(tagId: number, checked: boolean): void {
    if (checked) {
      if (!this.selectedTagIds.includes(tagId)) {
        this.selectedTagIds = [...this.selectedTagIds, tagId];
      }
    } else {
      this.selectedTagIds = this.selectedTagIds.filter((id) => id !== tagId);
    }

    this.cdr.detectChanges();
  }

  save(): void {
    if (this.selectedNewsId === 0) {
      this.errorMessage = 'Please select a news.';
      this.cdr.detectChanges();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    this.cdr.detectChanges();

    const request: AssignNewsTagRequest = {
      newsId: this.selectedNewsId,
      tagIds: [...this.selectedTagIds],
    };

    console.log('Saving News Tags:', request);

    this.newsTagService.assign(request).subscribe({
      next: (response) => {
        console.log('Save successful:', response);

        this.isSaving = false;

        // Clear selected news
        this.selectedNewsId = 0;

        // Clear selected tag IDs
        this.selectedTagIds = [];

        // Uncheck all tags
        this.tagList.forEach((tag) => {
          tag.selected = false;
        });

        this.cdr.detectChanges();

        alert('News Tags assigned successfully.');
      },

      error: (error) => {
        console.error('Save News Tags error:', error);

        this.isSaving = false;

        this.errorMessage = error?.error?.message || 'Unable to assign tags.';

        this.cdr.detectChanges();
      },
    });
  }
}
