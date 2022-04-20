import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselPublishComponent } from './carousel-publish.component';

describe('CarouselPublishComponent', () => {
  let component: CarouselPublishComponent;
  let fixture: ComponentFixture<CarouselPublishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarouselPublishComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselPublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
