import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseBeautificationTemplateComponent } from './course-beautification-template.component';

describe('CourseBeautificationTemplateComponent', () => {
  let component: CourseBeautificationTemplateComponent;
  let fixture: ComponentFixture<CourseBeautificationTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseBeautificationTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseBeautificationTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
