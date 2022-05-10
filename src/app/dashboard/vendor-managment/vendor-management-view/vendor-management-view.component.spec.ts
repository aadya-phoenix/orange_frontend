import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorManagementViewComponent } from './vendor-management-view.component';

describe('VendorManagementViewComponent', () => {
  let component: VendorManagementViewComponent;
  let fixture: ComponentFixture<VendorManagementViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorManagementViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorManagementViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
