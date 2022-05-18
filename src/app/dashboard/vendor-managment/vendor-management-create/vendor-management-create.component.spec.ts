import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorManagementCreateComponent } from './vendor-management-create.component';

describe('VendorManagementCreateComponent', () => {
  let component: VendorManagementCreateComponent;
  let fixture: ComponentFixture<VendorManagementCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorManagementCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorManagementCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
