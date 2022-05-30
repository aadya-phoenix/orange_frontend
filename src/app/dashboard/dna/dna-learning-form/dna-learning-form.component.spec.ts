import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DnaLearningFormComponent } from './dna-learning-form.component';

describe('DnaLearningFormComponent', () => {
  let component: DnaLearningFormComponent;
  let fixture: ComponentFixture<DnaLearningFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DnaLearningFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DnaLearningFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
