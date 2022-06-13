import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DnaManagerDataComponent } from './dna-manager-data.component';

describe('DnaManagerDataComponent', () => {
  let component: DnaManagerDataComponent;
  let fixture: ComponentFixture<DnaManagerDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DnaManagerDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DnaManagerDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
