import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorTrainingAddVendorComponent } from './vendor-training-add-vendor.component';

describe('VendorTrainingAddVendorComponent', () => {
  let component: VendorTrainingAddVendorComponent;
  let fixture: ComponentFixture<VendorTrainingAddVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorTrainingAddVendorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorTrainingAddVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
