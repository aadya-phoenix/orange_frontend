import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignLearningCreateComponent } from './design-learning-create.component';

describe('DesignLearningCreateComponent', () => {
  let component: DesignLearningCreateComponent;
  let fixture: ComponentFixture<DesignLearningCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignLearningCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignLearningCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
