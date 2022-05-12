import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetReportListComponent } from './get-report-list.component';

describe('GetReportListComponent', () => {
  let component: GetReportListComponent;
  let fixture: ComponentFixture<GetReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetReportListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
