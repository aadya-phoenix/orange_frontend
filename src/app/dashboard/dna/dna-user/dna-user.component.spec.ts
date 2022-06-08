import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DnaUserComponent } from './dna-user.component';

describe('DnaUserComponent', () => {
  let component: DnaUserComponent;
  let fixture: ComponentFixture<DnaUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DnaUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DnaUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
