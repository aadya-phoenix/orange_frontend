import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorManagementRatingReportComponent } from './vendor-management-rating-report.component';

describe('VendorManagementRatingReportComponent', () => {
  let component: VendorManagementRatingReportComponent;
  let fixture: ComponentFixture<VendorManagementRatingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorManagementRatingReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorManagementRatingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
