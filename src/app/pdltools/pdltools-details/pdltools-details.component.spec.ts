import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdltoolsDetailsComponent } from './pdltools-details.component';

describe('PdltoolsDetailsComponent', () => {
  let component: PdltoolsDetailsComponent;
  let fixture: ComponentFixture<PdltoolsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdltoolsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdltoolsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
