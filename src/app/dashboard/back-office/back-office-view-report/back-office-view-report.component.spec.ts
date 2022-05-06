import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackOfficeViewReportComponent } from './back-office-view-report.component';

describe('BackOfficeViewReportComponent', () => {
  let component: BackOfficeViewReportComponent;
  let fixture: ComponentFixture<BackOfficeViewReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackOfficeViewReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackOfficeViewReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
