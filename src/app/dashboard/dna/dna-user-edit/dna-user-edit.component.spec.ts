import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DnaUserEditComponent } from './dna-user-edit.component';

describe('DnaUserEditComponent', () => {
  let component: DnaUserEditComponent;
  let fixture: ComponentFixture<DnaUserEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DnaUserEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DnaUserEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
