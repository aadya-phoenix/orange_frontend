import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdltoolsComponent } from './pdltools.component';

describe('PdltoolsComponent', () => {
  let component: PdltoolsComponent;
  let fixture: ComponentFixture<PdltoolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdltoolsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdltoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
