import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlTestListComponent } from './ol-test-list.component';

describe('OlTestListComponent', () => {
  let component: OlTestListComponent;
  let fixture: ComponentFixture<OlTestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OlTestListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OlTestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
