import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackOfficeListComponent } from './back-office-list.component';

describe('BackOfficeListComponent', () => {
  let component: BackOfficeListComponent;
  let fixture: ComponentFixture<BackOfficeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackOfficeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackOfficeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
