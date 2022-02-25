import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCourseDetailsComponent } from './view-course-details.component';

describe('ViewCourseDetailsComponent', () => {
  let component: ViewCourseDetailsComponent;
  let fixture: ComponentFixture<ViewCourseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCourseDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCourseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
