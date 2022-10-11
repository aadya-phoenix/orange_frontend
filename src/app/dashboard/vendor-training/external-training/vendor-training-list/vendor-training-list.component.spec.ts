import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorTrainingListComponent } from './vendor-training-list.component';

describe('VendorTrainingListComponent', () => {
  let component: VendorTrainingListComponent;
  let fixture: ComponentFixture<VendorTrainingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorTrainingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorTrainingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
