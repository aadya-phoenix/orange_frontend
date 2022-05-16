import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorManagementStatusComponent } from './vendor-management-status.component';

describe('VendorManagementStatusComponent', () => {
  let component: VendorManagementStatusComponent;
  let fixture: ComponentFixture<VendorManagementStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorManagementStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorManagementStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
