import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignLearningChatComponent } from './design-learning-chat.component';

describe('DesignLearningChatComponent', () => {
  let component: DesignLearningChatComponent;
  let fixture: ComponentFixture<DesignLearningChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignLearningChatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignLearningChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
