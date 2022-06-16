import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DnaViewRptComponent } from './dna-view-rpt.component';

describe('DnaViewRptComponent', () => {
  let component: DnaViewRptComponent;
  let fixture: ComponentFixture<DnaViewRptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DnaViewRptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DnaViewRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
