import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetReportTransferToOtherRocComponent } from './get-report-transfer-to-other-roc.component';

describe('GetReportTransferToOtherRocComponent', () => {
  let component: GetReportTransferToOtherRocComponent;
  let fixture: ComponentFixture<GetReportTransferToOtherRocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetReportTransferToOtherRocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetReportTransferToOtherRocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
