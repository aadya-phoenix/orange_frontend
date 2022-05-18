import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetReportCreateComponent } from './get-report-create.component';

describe('GetReportCreateComponent', () => {
  let component: GetReportCreateComponent;
  let fixture: ComponentFixture<GetReportCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetReportCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetReportCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
