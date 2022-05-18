import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetReportPublishComponent } from './get-report-publish.component';

describe('GetReportPublishComponent', () => {
  let component: GetReportPublishComponent;
  let fixture: ComponentFixture<GetReportPublishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetReportPublishComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetReportPublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
