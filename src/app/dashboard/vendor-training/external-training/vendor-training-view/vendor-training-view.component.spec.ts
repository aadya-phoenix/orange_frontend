import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorTrainingViewComponent } from './vendor-training-view.component';

describe('VendorTrainingViewComponent', () => {
  let component: VendorTrainingViewComponent;
  let fixture: ComponentFixture<VendorTrainingViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorTrainingViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorTrainingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
