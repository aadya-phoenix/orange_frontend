import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DnaCompleteReportComponent } from './dna-complete-report.component';

describe('DnaCompleteReportComponent', () => {
  let component: DnaCompleteReportComponent;
  let fixture: ComponentFixture<DnaCompleteReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DnaCompleteReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DnaCompleteReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
