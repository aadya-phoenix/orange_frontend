import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionCompleteReportComponent } from './session-complete-report.component';

describe('SessionCompleteReportComponent', () => {
  let component: SessionCompleteReportComponent;
  let fixture: ComponentFixture<SessionCompleteReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionCompleteReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionCompleteReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
