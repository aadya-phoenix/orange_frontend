import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldToolCompleteReportComponent } from './gold-tool-complete-report.component';

describe('GoldToolCompleteReportComponent', () => {
  let component: GoldToolCompleteReportComponent;
  let fixture: ComponentFixture<GoldToolCompleteReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoldToolCompleteReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoldToolCompleteReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
