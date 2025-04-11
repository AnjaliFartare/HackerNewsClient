import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoryListComponent } from './story-list.component';
import { StoryService } from '../story.service';
import { of, throwError } from 'rxjs';
import { Story } from 'src/app/Model/story';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('StoryListComponent', () => {
  let component: StoryListComponent;
  let fixture: ComponentFixture<StoryListComponent>;
  let storyService: jasmine.SpyObj<StoryService>;

  const mockStories: Story[] = [
    { id: 1, title: 'Test Story 1', url: 'http://example.com/1' },
    { id: 2, title: 'Test Story 2', url: 'http://example.com/2' },
  ];

  beforeEach(async () => {
    const storyServiceSpy = jasmine.createSpyObj('StoryService', ['getStories']);

    await TestBed.configureTestingModule({
      declarations: [StoryListComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: StoryService, useValue: storyServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(StoryListComponent);
    component = fixture.componentInstance;
    storyService = TestBed.inject(StoryService) as jasmine.SpyObj<StoryService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load stories on init', () => {
    storyService.getStories.and.returnValue(of(mockStories));
    component.ngOnInit();
    expect(storyService.getStories).toHaveBeenCalledWith('', 1);
    expect(component.stories.length).toBe(2);
  });

  it('should search stories and reset to page 1', () => {
    storyService.getStories.and.returnValue(of(mockStories));
    component.page = 3;
    component.search = 'Angular';
    component.searchStories();
    expect(component.page).toBe(1);
    expect(storyService.getStories).toHaveBeenCalledWith('Angular', 1);
    expect(component.stories).toEqual(mockStories);
  });

  it('should go to next page and load stories', () => {
    storyService.getStories.and.returnValue(of(mockStories));
    component.page = 1;
    component.nextPage();
    expect(component.page).toBe(2);
    expect(storyService.getStories).toHaveBeenCalledWith('', 2);
  });

  it('should go to previous page if page > 1', () => {
    storyService.getStories.and.returnValue(of(mockStories));
    component.page = 3;
    component.prevPage();
    expect(component.page).toBe(2);
    expect(storyService.getStories).toHaveBeenCalledWith('', 2);
  });

  it('should not go to previous page if page is 1', () => {
    storyService.getStories.calls.reset();
    component.page = 1;
    component.prevPage();
    expect(storyService.getStories).not.toHaveBeenCalled();
  });

  it('should handle error from service gracefully', () => {
    spyOn(console, 'error');
    storyService.getStories.and.returnValue(throwError(() => new Error('Service error')));
    component.loadStories();
    expect(console.error).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });
});
