import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselForwardComponent } from './carousel-forward.component';

describe('CarouselForwardComponent', () => {
  let component: CarouselForwardComponent;
  let fixture: ComponentFixture<CarouselForwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarouselForwardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselForwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
