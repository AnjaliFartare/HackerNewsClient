import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Story } from './Model/story';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppserviceService {

  constructor(private http: HttpClient) {}

  getStories(search: string = '', page: number = 1, pageSize: number = 20): Observable<Story[]> {
    return this.http.get<Story[]>(`http://localhost:5000/api/hackernews?search=${search}&page=${page}&pageSize=${pageSize}`);
  }
}
