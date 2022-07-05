import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignLearningHistoryComponent } from './design-learning-history.component';

describe('DesignLearningHistoryComponent', () => {
  let component: DesignLearningHistoryComponent;
  let fixture: ComponentFixture<DesignLearningHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignLearningHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignLearningHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
