import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackOfficeHistoryComponent } from './back-office-history.component';

describe('BackOfficeHistoryComponent', () => {
  let component: BackOfficeHistoryComponent;
  let fixture: ComponentFixture<BackOfficeHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackOfficeHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackOfficeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
