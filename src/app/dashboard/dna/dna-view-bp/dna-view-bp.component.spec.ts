import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DnaViewBpComponent } from './dna-view-bp.component';

describe('DnaViewBpComponent', () => {
  let component: DnaViewBpComponent;
  let fixture: ComponentFixture<DnaViewBpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DnaViewBpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DnaViewBpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
