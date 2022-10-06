import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlTestQuestionCreateComponent } from './ol-test-question-create.component';

describe('OlTestQuestionCreateComponent', () => {
  let component: OlTestQuestionCreateComponent;
  let fixture: ComponentFixture<OlTestQuestionCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OlTestQuestionCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OlTestQuestionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
