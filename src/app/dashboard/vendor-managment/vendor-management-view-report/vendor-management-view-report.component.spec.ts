import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorManagementViewReportComponent } from './vendor-management-view-report.component';

describe('VendorManagementViewReportComponent', () => {
  let component: VendorManagementViewReportComponent;
  let fixture: ComponentFixture<VendorManagementViewReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorManagementViewReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorManagementViewReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
