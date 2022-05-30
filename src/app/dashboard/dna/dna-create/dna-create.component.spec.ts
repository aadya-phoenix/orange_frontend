import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DnaCreateComponent } from './dna-create.component';

describe('DnaCreateComponent', () => {
  let component: DnaCreateComponent;
  let fixture: ComponentFixture<DnaCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DnaCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DnaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
