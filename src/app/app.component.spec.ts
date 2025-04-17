import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';  // Standalone component
import { AppserviceService } from './appservice.service';
import { of, throwError } from 'rxjs';
import { Story } from './Model/story';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockService: jasmine.SpyObj<AppserviceService>;

  const mockStories: Story[] = [
    { title: 'Test Story 1', url: 'http://example.com/1', id: 0 },
    { title: 'Test Story 2', url: 'http://example.com/2', id: 1 }
  ];

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('AppserviceService', ['getStories']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, HttpClientTestingModule, AppComponent],
      providers: [
        { provide: AppserviceService, useValue: mockService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadStories on ngOnInit and populate stories', () => {
    mockService.getStories.and.returnValue(of(mockStories));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.stories.length).toBe(0);
  });

  it('should handle error in loadStories()', () => {
    spyOn(console, 'error');
    mockService.getStories.and.returnValue(throwError(() => new Error('API error')));
    
    component.loadStories();
    fixture.detectChanges();

    expect(component.loading).toBeFalse();
  });

  it('should reset page and load stories on searchStories()', () => {
    mockService.getStories.and.returnValue(of(mockStories));
    component.page = 3;
    component.search = 'angular';
    component.searchStories();
    fixture.detectChanges();
    expect(component.page).toBe(1);
  });

  it('should go to next page and load stories', () => {
    mockService.getStories.and.returnValue(of(mockStories));
    component.page = 1;
    component.nextPage();
    fixture.detectChanges();
    expect(component.page).toBe(2);
  });

  it('should go to previous page only if page > 1', () => {
    mockService.getStories.and.returnValue(of(mockStories));
    component.page = 3;
    component.prevPage();
    fixture.detectChanges();
    expect(component.page).toBe(2);
  });

  it('should not go to previous page if page is 1', () => {
    mockService.getStories.and.returnValue(of(mockStories));
    component.page = 1;
    component.prevPage();
    fixture.detectChanges();
    expect(component.page).toBe(1);
  });
});
