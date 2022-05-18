import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetReportViewComponent } from './get-report-view.component';

describe('GetReportViewComponent', () => {
  let component: GetReportViewComponent;
  let fixture: ComponentFixture<GetReportViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetReportViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetReportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
