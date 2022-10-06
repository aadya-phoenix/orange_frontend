import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorTrainingFormComponent } from './vendor-training-form.component';

describe('VendorTrainingFormComponent', () => {
  let component: VendorTrainingFormComponent;
  let fixture: ComponentFixture<VendorTrainingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorTrainingFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorTrainingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
