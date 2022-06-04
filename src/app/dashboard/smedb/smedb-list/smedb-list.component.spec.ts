import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmedbListComponent } from './smedb-list.component';

describe('SmedbListComponent', () => {
  let component: SmedbListComponent;
  let fixture: ComponentFixture<SmedbListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmedbListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmedbListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
