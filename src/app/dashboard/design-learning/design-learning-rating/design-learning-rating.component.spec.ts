import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignLearningRatingComponent } from './design-learning-rating.component';

describe('DesignLearningRatingComponent', () => {
  let component: DesignLearningRatingComponent;
  let fixture: ComponentFixture<DesignLearningRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignLearningRatingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignLearningRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
