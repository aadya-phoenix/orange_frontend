import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetReportForwardComponent } from './get-report-forward.component';

describe('GetReportForwardComponent', () => {
  let component: GetReportForwardComponent;
  let fixture: ComponentFixture<GetReportForwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetReportForwardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetReportForwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
