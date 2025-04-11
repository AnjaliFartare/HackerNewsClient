import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Story } from '../Model/story';

@Injectable({ providedIn: 'root' })
export class StoryService {
  constructor(private http: HttpClient) {}

  getStories(search: string = '', page: number = 1, pageSize: number = 20): Observable<Story[]> {
    return this.http.get<Story[]>(`https://localhost:7107/api/hackernews?search=${search}&page=${page}&pageSize=${pageSize}`);
  }
}