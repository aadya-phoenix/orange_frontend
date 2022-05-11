import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetReportHistoryComponent } from './get-report-history.component';

describe('GetReportHistoryComponent', () => {
  let component: GetReportHistoryComponent;
  let fixture: ComponentFixture<GetReportHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetReportHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetReportHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
