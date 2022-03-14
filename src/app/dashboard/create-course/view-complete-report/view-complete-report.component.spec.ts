import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompleteReportComponent } from './view-complete-report.component';

describe('ViewCompleteReportComponent', () => {
  let component: ViewCompleteReportComponent;
  let fixture: ComponentFixture<ViewCompleteReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCompleteReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCompleteReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
