import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmedbRatingComponent } from './smedb-rating.component';

describe('SmedbRatingComponent', () => {
  let component: SmedbRatingComponent;
  let fixture: ComponentFixture<SmedbRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmedbRatingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmedbRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
