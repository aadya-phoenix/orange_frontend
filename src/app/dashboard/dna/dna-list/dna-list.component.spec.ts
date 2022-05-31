import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DnaListComponent } from './dna-list.component';

describe('DnaListComponent', () => {
  let component: DnaListComponent;
  let fixture: ComponentFixture<DnaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DnaListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DnaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
