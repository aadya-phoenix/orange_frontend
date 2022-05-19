import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetReportCloseOnUpdateComponent } from './get-report-close-on-update.component';

describe('GetReportCloseOnUpdateComponent', () => {
  let component: GetReportCloseOnUpdateComponent;
  let fixture: ComponentFixture<GetReportCloseOnUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetReportCloseOnUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetReportCloseOnUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
