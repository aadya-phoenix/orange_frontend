import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCompleteReportComponent } from './course-complete-report.component';

describe('CourseCompleteReportComponent', () => {
  let component: CourseCompleteReportComponent;
  let fixture: ComponentFixture<CourseCompleteReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseCompleteReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseCompleteReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
