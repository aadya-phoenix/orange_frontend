import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlTestCreateScormComponent } from './ol-test-create-scorm.component';

describe('OlTestCreateScormComponent', () => {
  let component: OlTestCreateScormComponent;
  let fixture: ComponentFixture<OlTestCreateScormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OlTestCreateScormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OlTestCreateScormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
