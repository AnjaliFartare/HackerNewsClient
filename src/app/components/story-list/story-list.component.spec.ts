import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoryListComponent } from './story-list.component';
import { StoryService } from '../story.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Story } from 'src/app/Model/story';

describe('StoryListComponent - loadStories', () => {
  let component: StoryListComponent;
  let fixture: ComponentFixture<StoryListComponent>;
  let storyServiceSpy: jasmine.SpyObj<StoryService>;

  const mockStories: Story[] = [
    { id: 1, title: 'Test Story 1', url: 'http://example.com/1' },
    { id: 2, title: 'Test Story 2', url: 'http://example.com/2' },
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('StoryService', ['getStories']);

    await TestBed.configureTestingModule({
      declarations: [StoryListComponent],
      imports: [HttpClientTestingModule],
      providers: [{ provide: StoryService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(StoryListComponent);
    component = fixture.componentInstance;
    storyServiceSpy = TestBed.inject(StoryService) as jasmine.SpyObj<StoryService>;
  });

  it('should load stories and update state on success', () => {
    storyServiceSpy.getStories.and.returnValue(of(mockStories));
    component.loadStories();
    expect(storyServiceSpy.getStories).toHaveBeenCalledWith(component.search, component.page);
    expect(component.stories).toEqual(mockStories);
    expect(component.loading).toBeFalse();
  });

  it('should handle error and set loading to false', () => {
    const consoleSpy = spyOn(console, 'error');
    storyServiceSpy.getStories.and.returnValue(throwError(() => new Error('Failed to fetch')));
    component.loadStories();
    expect(consoleSpy).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });
});
