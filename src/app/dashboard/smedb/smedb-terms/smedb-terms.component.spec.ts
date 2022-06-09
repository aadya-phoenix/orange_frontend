import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmedbTermsComponent } from './smedb-terms.component';

describe('SmedbTermsComponent', () => {
  let component: SmedbTermsComponent;
  let fixture: ComponentFixture<SmedbTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmedbTermsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmedbTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
