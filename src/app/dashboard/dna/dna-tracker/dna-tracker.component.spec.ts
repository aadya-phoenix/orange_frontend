import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DnaTrackerComponent } from './dna-tracker.component';

describe('DnaTrackerComponent', () => {
  let component: DnaTrackerComponent;
  let fixture: ComponentFixture<DnaTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DnaTrackerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DnaTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
