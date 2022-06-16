import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningNeedsComponent } from './learning-needs.component';

describe('LearningNeedsComponent', () => {
  let component: LearningNeedsComponent;
  let fixture: ComponentFixture<LearningNeedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearningNeedsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LearningNeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
