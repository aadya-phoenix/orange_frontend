import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DnaViewComponent } from './dna-view.component';

describe('DnaViewComponent', () => {
  let component: DnaViewComponent;
  let fixture: ComponentFixture<DnaViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DnaViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DnaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
