import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignLearningListComponent } from './design-learning-list.component';

describe('DesignLearningListComponent', () => {
  let component: DesignLearningListComponent;
  let fixture: ComponentFixture<DesignLearningListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignLearningListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignLearningListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
