import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorManagementHistoryComponent } from './vendor-management-history.component';

describe('VendorManagementHistoryComponent', () => {
  let component: VendorManagementHistoryComponent;
  let fixture: ComponentFixture<VendorManagementHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorManagementHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorManagementHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
