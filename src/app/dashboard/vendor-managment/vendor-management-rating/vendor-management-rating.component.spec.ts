import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorManagementRatingComponent } from './vendor-management-rating.component';

describe('VendorManagementRatingComponent', () => {
  let component: VendorManagementRatingComponent;
  let fixture: ComponentFixture<VendorManagementRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorManagementRatingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorManagementRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
