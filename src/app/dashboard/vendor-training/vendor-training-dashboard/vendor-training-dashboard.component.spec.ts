import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorTrainingDashboardComponent } from './vendor-training-dashboard.component';

describe('VendorTrainingDashboardComponent', () => {
  let component: VendorTrainingDashboardComponent;
  let fixture: ComponentFixture<VendorTrainingDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorTrainingDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorTrainingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
