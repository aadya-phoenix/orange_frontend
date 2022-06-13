import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DnaForwardComponent } from './dna-forward.component';

describe('DnaForwardComponent', () => {
  let component: DnaForwardComponent;
  let fixture: ComponentFixture<DnaForwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DnaForwardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DnaForwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
