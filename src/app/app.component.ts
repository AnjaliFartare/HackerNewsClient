import { Component, OnInit } from '@angular/core';
import { Story } from './Model/story';
import { AppserviceService } from './appservice.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [FormsModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [AppserviceService]
})
export class AppComponent implements OnInit {
  public stories: Story[] = [];
  public search: string = '';
  public page = 1;
  public loading = false; 

  constructor(private appservice: AppserviceService) {}

  ngOnInit() {
    this.loadStories();
  }

public loadStories() {
    this.appservice.getStories(this.search, this.page).subscribe({
      next: (data) => {
        this.stories = data;
        this.loading = false; 
      },
      error: (err) => {
        console.error(err);
        this.loading = false; 
      }
    });
  }

  public  searchStories() {
    this.loading = true; 
    this.page = 1;
    this.loadStories();
  }

  public nextPage() {
    this.loading = true; 
    this.page++;
    this.loadStories();
  }

  public prevPage() {
    this.loading = true; 
    if (this.page > 1) {
      this.page--;
      this.loadStories();
    }
  }
}
