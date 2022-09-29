import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlTestCreateModelComponent } from './ol-test-create-model.component';

describe('OlTestCreateModelComponent', () => {
  let component: OlTestCreateModelComponent;
  let fixture: ComponentFixture<OlTestCreateModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OlTestCreateModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OlTestCreateModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
