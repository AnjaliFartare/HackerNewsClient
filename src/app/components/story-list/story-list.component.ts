import { Component, OnInit } from '@angular/core';
import { Story } from 'src/app/Model/story';
import { StoryService } from '../story.service';

@Component({
  selector: 'app-story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss'],
  providers: [StoryService]
})
export class StoryListComponent implements OnInit {
  public stories: Story[] = [];
  public search: string = '';
  public page = 1;
  public loading = false; 

  constructor(private storyService: StoryService) {}

  ngOnInit() {
    this.loadStories();
  }

public loadStories() {
    this.storyService.getStories(this.search, this.page).subscribe({
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
