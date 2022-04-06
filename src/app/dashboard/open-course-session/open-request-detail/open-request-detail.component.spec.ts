import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenRequestDetailComponent } from './open-request-detail.component';

describe('OpenRequestDetailComponent', () => {
  let component: OpenRequestDetailComponent;
  let fixture: ComponentFixture<OpenRequestDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenRequestDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenRequestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
