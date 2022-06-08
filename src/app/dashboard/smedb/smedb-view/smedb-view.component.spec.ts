import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmedbViewComponent } from './smedb-view.component';

describe('SmedbViewComponent', () => {
  let component: SmedbViewComponent;
  let fixture: ComponentFixture<SmedbViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmedbViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmedbViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
