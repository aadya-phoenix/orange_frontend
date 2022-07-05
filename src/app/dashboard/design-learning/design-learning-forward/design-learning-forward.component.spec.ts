import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignLearningForwardComponent } from './design-learning-forward.component';

describe('DesignLearningForwardComponent', () => {
  let component: DesignLearningForwardComponent;
  let fixture: ComponentFixture<DesignLearningForwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignLearningForwardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignLearningForwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
