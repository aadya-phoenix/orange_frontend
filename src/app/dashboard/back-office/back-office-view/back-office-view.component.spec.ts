import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackOfficeViewComponent } from './back-office-view.component';

describe('BackOfficeViewComponent', () => {
  let component: BackOfficeViewComponent;
  let fixture: ComponentFixture<BackOfficeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackOfficeViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackOfficeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
