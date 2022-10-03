import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlTestSectionCreateComponent } from './ol-test-section-create.component';

describe('OlTestSectionCreateComponent', () => {
  let component: OlTestSectionCreateComponent;
  let fixture: ComponentFixture<OlTestSectionCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OlTestSectionCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OlTestSectionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
