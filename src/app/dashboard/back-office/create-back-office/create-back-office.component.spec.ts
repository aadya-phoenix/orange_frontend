import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBackOfficeComponent } from './create-back-office.component';

describe('CreateBackOfficeComponent', () => {
  let component: CreateBackOfficeComponent;
  let fixture: ComponentFixture<CreateBackOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBackOfficeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBackOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
