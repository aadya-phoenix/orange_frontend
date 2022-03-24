import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOpenCourseComponent } from './create-open-course.component';

describe('CreateOpenCourseComponent', () => {
  let component: CreateOpenCourseComponent;
  let fixture: ComponentFixture<CreateOpenCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOpenCourseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOpenCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
