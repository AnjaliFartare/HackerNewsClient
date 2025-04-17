import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppserviceService } from './appservice.service';
import { Story } from './Model/story';

describe('AppserviceService', () => {
  let service: AppserviceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppserviceService]
    });

    service = TestBed.inject(AppserviceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch stories with default parameters', () => {
    const mockStories: Story[] = [
      {
        title: 'Story 1', url: 'https://story1.com',
        id: 0
      },
      {
        title: 'Story 2', url: 'https://story2.com',
        id: 0
      }
    ];

    service.getStories().subscribe(stories => {
      expect(stories.length).toBe(2);
      expect(stories).toEqual(mockStories);
    });

    const req = httpMock.expectOne('http://localhost:5000/api/hackernews?search=&page=1&pageSize=20');
    expect(req.request.method).toBe('GET');
    req.flush(mockStories);
  });

  it('should include query parameters in the request', () => {
    const search = 'angular';
    const page = 2;
    const pageSize = 10;

    service.getStories(search, page, pageSize).subscribe();

    const req = httpMock.expectOne(`http://localhost:5000/api/hackernews?search=angular&page=2&pageSize=10`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
