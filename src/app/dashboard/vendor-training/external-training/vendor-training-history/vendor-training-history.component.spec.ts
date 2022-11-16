import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorTrainingHistoryComponent } from './vendor-training-history.component';

describe('VendorTrainingHistoryComponent', () => {
  let component: VendorTrainingHistoryComponent;
  let fixture: ComponentFixture<VendorTrainingHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorTrainingHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorTrainingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
