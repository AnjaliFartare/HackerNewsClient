import { TestBed } from '@angular/core/testing';
import { NewsService } from './news.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('NewsService', () => {
  let service: NewsService;
  let httpMock: HttpTestingController;

  const mockResponse = {
    stories: [
      { id: 1, title: 'Angular News', url: 'http://example.com/1' },
      { id: 2, title: 'TypeScript Update', url: 'http://example.com/2' }
    ],
    totalPages: 40
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NewsService]
    });

    service = TestBed.inject(NewsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call GET with correct query parameters and return stories', () => {
    const search = 'angular';
    const page = 2;
    const pageSize = 20;

    service.getStories(search, page, pageSize).subscribe((res) => {
      expect(res.stories.length).toBe(2);
      expect(res.totalPages).toBe(40);
    });

    const req = httpMock.expectOne(
      r => r.method === 'GET' &&
           r.url === 'http://localhost:5000/api/hackernews' &&
           r.params.get('search') === search &&
           r.params.get('page') === page.toString() &&
           r.params.get('pageSize') === pageSize.toString()
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle error and return observable error', () => {
    const search = 'fail';
    const page = 1;
    const pageSize = 10;

    service.getStories(search, page, pageSize).subscribe({
      next: () => fail('Should have thrown an error'),
      error: (err) => {
        expect(err.status).toBe(500);
        expect(err.statusText).toBe('Internal Server Error');
      }
    });

    const req = httpMock.expectOne(
      r => r.url.includes('/api/hackernews')
    );

    req.flush({ message: 'Server error' }, { status: 500, statusText: 'Internal Server Error' });
  });
});