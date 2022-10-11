import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorTrainingEvaluationComponent } from './vendor-training-evaluation.component';

describe('VendorTrainingEvaluationComponent', () => {
  let component: VendorTrainingEvaluationComponent;
  let fixture: ComponentFixture<VendorTrainingEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorTrainingEvaluationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorTrainingEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
