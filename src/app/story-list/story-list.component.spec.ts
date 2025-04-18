import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { StoryListComponent } from './story-list.component';
import { NewsService } from '../services/news.service';
import { of, throwError } from 'rxjs';
import { Story } from '../model/story';
import { PaginatorComponent } from '../paginator/paginator.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('StoryListComponent', () => {
  let component: StoryListComponent;
  let fixture: ComponentFixture<StoryListComponent>;
  let mockNewsService: jasmine.SpyObj<NewsService>;

  const mockStories: Story[] = [
    { id: 1, title: 'Test Story 1', url: 'http://example.com/1' },
    { id: 2, title: 'Test Story 2', url: 'http://example.com/2' }
  ];

  beforeEach(waitForAsync(() => {
    mockNewsService = jasmine.createSpyObj('NewsService', ['getStories']);

    TestBed.configureTestingModule({
      imports: [StoryListComponent, FormsModule, CommonModule, PaginatorComponent],
      providers: [{ provide: NewsService, useValue: mockNewsService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadStories on ngOnInit and populate stories', () => {
    spyOn(component, 'loadStories');
    component.ngOnInit();
    expect(component.loadStories).toHaveBeenCalled();
  });

  it('should populate stories and totalPages in loadStories()', () => {
    mockNewsService.getStories.and.returnValue(of({
      stories: mockStories,
      totalPages: 40
    }));

    component.loadStories();

    expect(component.loading).toBeFalse();
    expect(component.stories.length).toBe(2);
    expect(component.totalPages).toBe(2);
    expect(component.lastPageReached).toBeFalse();
  });

  it('should handle error in loadStories()', () => {
    mockNewsService.getStories.and.returnValue(throwError(() => new Error('Service error')));

    component.loadStories();

    expect(component.loading).toBeFalse();
    expect(component.stories.length).toBe(0);
    expect(component.totalPages).toBe(0);
    expect(component.lastPageReached).toBeFalse(); 
  });

  it('should reset page and call loadStories on searchStories()', () => {
    spyOn(component, 'loadStories');
    component.page = 3;
    component.searchStories();
    expect(component.page).toBe(1);
    expect(component.loadStories).toHaveBeenCalled();
  });

  it('should increase page and call loadStories on nextPage()', () => {
    spyOn(component, 'loadStories');
    component.page = 1;
    component.totalPages = 3;
    component.lastPageReached = false;
    component.nextPage();
    expect(component.page).toBe(2);
    expect(component.loadStories).toHaveBeenCalled();
  });

  it('should decrease page and call loadStories on prevPage()', () => {
    spyOn(component, 'loadStories');
    component.page = 2;
    component.prevPage();
    expect(component.page).toBe(1);
    expect(component.loadStories).toHaveBeenCalled();
  });

  it('should go to valid page and call loadStories on goToPage()', () => {
    spyOn(component, 'loadStories');
    component.totalPages = 5;
    component.goToPage(3);
    expect(component.page).toBe(3);
    expect(component.loadStories).toHaveBeenCalled();
  });

  it('should not go to invalid page on goToPage()', () => {
    spyOn(component, 'loadStories');
    component.totalPages = 5;
    component.goToPage(0); 
    expect(component.page).not.toBe(0);
    expect(component.loadStories).not.toHaveBeenCalled();
  });
});
