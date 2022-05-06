import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackOfficePublishComponent } from './back-office-publish.component';

describe('BackOfficePublishComponent', () => {
  let component: BackOfficePublishComponent;
  let fixture: ComponentFixture<BackOfficePublishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackOfficePublishComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackOfficePublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
