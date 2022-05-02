import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionPublisherComponent } from './session-publisher.component';

describe('SessionPublisherComponent', () => {
  let component: SessionPublisherComponent;
  let fixture: ComponentFixture<SessionPublisherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionPublisherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionPublisherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
