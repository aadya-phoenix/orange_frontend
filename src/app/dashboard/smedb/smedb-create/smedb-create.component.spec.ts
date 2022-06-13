import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmedbCreateComponent } from './smedb-create.component';

describe('SmedbCreateComponent', () => {
  let component: SmedbCreateComponent;
  let fixture: ComponentFixture<SmedbCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmedbCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmedbCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
