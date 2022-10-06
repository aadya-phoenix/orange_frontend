import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlTestViewComponent } from './ol-test-view.component';

describe('OlTestViewComponent', () => {
  let component: OlTestViewComponent;
  let fixture: ComponentFixture<OlTestViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OlTestViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OlTestViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
