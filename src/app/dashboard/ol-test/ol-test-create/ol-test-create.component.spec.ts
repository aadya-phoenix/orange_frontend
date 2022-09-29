import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlTestCreateComponent } from './ol-test-create.component';

describe('OlTestCreateComponent', () => {
  let component: OlTestCreateComponent;
  let fixture: ComponentFixture<OlTestCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OlTestCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OlTestCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
