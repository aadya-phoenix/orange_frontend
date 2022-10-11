import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorTrainingPoApprovalComponent } from './vendor-training-po-approval.component';

describe('VendorTrainingPoApprovalComponent', () => {
  let component: VendorTrainingPoApprovalComponent;
  let fixture: ComponentFixture<VendorTrainingPoApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorTrainingPoApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorTrainingPoApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
