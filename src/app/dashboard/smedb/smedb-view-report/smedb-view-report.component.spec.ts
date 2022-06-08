import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmedbViewReportComponent } from './smedb-view-report.component';

describe('SmedbViewReportComponent', () => {
  let component: SmedbViewReportComponent;
  let fixture: ComponentFixture<SmedbViewReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmedbViewReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmedbViewReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
