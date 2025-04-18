import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Story } from '../model/story';
import { NewsService } from '../services/news.service';
import { PaginatorComponent } from '../paginator/paginator.component';

@Component({
  selector: 'app-story-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginatorComponent],
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss']
})
export class StoryListComponent implements OnInit {
  stories: Story[] = [];
  search: string = '';
  page: number = 1;
  pageSize: number = 20;
  totalPages: number = 0;
  loading: boolean = false;
  lastPageReached: boolean = false;

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.loadStories();
  }

  loadStories(): void {
    const trimmedSearch = this.search.trim();
    this.loading = true;
    this.stories = []; 
    this.newsService.getStories(trimmedSearch, this.page, this.pageSize).subscribe({
      next: (response: any) => {
        this.stories = response.stories;
        this.totalPages = Math.ceil(response.totalPages / this.pageSize);
        this.lastPageReached = this.page >= this.totalPages;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading stories:', err);
        this.stories = [];
        this.totalPages = 0;
        this.loading = false;
      }
    });
  }

  searchStories(): void {
    this.page = 1;
    this.loadStories();
  }

  nextPage(): void {
    if (!this.lastPageReached) {
      this.page++;
      this.loadStories();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadStories();
    }
  }

  goToPage(pageNum: number): void {
    if (pageNum >= 1 && pageNum <= this.totalPages) {
      this.page = pageNum;
      this.loadStories();
    }
  }
}