import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DnaTrackerCreateComponent } from './dna-tracker-create.component';

describe('DnaTrackerCreateComponent', () => {
  let component: DnaTrackerCreateComponent;
  let fixture: ComponentFixture<DnaTrackerCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DnaTrackerCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DnaTrackerCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
