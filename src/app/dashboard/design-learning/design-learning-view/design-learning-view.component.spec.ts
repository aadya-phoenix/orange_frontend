import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignLearningViewComponent } from './design-learning-view.component';

describe('DesignLearningViewComponent', () => {
  let component: DesignLearningViewComponent;
  let fixture: ComponentFixture<DesignLearningViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignLearningViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignLearningViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
