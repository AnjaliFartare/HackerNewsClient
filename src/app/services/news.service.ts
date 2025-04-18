import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Story } from '../model/story';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private baseUrl = 'http://localhost:5000';
  constructor(private http: HttpClient) {}

  getStories(search: string, page: number, pageSize: number): Observable<{ stories: Story[], totalPages: number }> {
    const params = new HttpParams()
      .set('search', search)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
  
    return this.http.get<{ stories: Story[], totalPages: number }>(`${this.baseUrl}/api/hackernews`, { params });
  }
}
