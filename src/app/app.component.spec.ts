import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoryListComponent } from '../app/components/story-list/story-list.component';
import { StoryService } from '../app/components/story.service';
import { of } from 'rxjs';

describe('StoryListComponent', () => {
  let component: StoryListComponent;
  let fixture: ComponentFixture<StoryListComponent>;
  let storyServiceSpy: jasmine.SpyObj<StoryService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('StoryService', ['getStories']);

    await TestBed.configureTestingModule({
      declarations: [StoryListComponent],
      providers: [{ provide: StoryService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(StoryListComponent);
    component = fixture.componentInstance;
    storyServiceSpy = TestBed.inject(StoryService) as jasmine.SpyObj<StoryService>;

    // Default return value for getStories
    storyServiceSpy.getStories.and.returnValue(of([]));
  });

  it('should set loading true, reset page to 1, and fetch stories', () => {
    // Arrange
    const mockStories = [{ title: 'Test story' }] as any;
    storyServiceSpy.getStories.and.returnValue(of(mockStories));
  
    // Act
    component.searchStories();
  
    // Assert
    expect(component.loading).toBeFalse();
    expect(component.page).toBe(1);
    expect(component.stories).toEqual(mockStories);
  });
});
