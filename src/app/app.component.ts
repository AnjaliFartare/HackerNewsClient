import { Component } from '@angular/core';
import { StoryListComponent } from './story-list/story-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [StoryListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}