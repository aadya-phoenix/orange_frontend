import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselHistoryComponent } from './carousel-history.component';

describe('CarouselHistoryComponent', () => {
  let component: CarouselHistoryComponent;
  let fixture: ComponentFixture<CarouselHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarouselHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
