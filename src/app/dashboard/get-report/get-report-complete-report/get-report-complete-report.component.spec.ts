import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetReportCompleteReportComponent } from './get-report-complete-report.component';

describe('GetReportCompleteReportComponent', () => {
  let component: GetReportCompleteReportComponent;
  let fixture: ComponentFixture<GetReportCompleteReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetReportCompleteReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetReportCompleteReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
