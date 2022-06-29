import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignLearningCompleteReportComponent } from './design-learning-complete-report.component';

describe('DesignLearningCompleteReportComponent', () => {
  let component: DesignLearningCompleteReportComponent;
  let fixture: ComponentFixture<DesignLearningCompleteReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignLearningCompleteReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignLearningCompleteReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
