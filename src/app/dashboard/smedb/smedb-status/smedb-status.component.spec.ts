import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmedbStatusComponent } from './smedb-status.component';

describe('SmedbStatusComponent', () => {
  let component: SmedbStatusComponent;
  let fixture: ComponentFixture<SmedbStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmedbStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmedbStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
