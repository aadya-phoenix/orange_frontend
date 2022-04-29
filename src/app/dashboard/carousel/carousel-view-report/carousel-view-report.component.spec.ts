import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselViewReportComponent } from './carousel-view-report.component';

describe('CarouselViewReportComponent', () => {
  let component: CarouselViewReportComponent;
  let fixture: ComponentFixture<CarouselViewReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarouselViewReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselViewReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
