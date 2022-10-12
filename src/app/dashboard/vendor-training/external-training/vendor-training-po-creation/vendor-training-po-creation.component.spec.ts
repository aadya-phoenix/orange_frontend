import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorTrainingPoCreationComponent } from './vendor-training-po-creation.component';

describe('VendorTrainingPoCreationComponent', () => {
  let component: VendorTrainingPoCreationComponent;
  let fixture: ComponentFixture<VendorTrainingPoCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorTrainingPoCreationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorTrainingPoCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
