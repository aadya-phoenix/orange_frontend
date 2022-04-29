import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackOfficeForwardComponent } from './back-office-forward.component';

describe('BackOfficeForwardComponent', () => {
  let component: BackOfficeForwardComponent;
  let fixture: ComponentFixture<BackOfficeForwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackOfficeForwardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackOfficeForwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
