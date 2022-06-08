import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmedbHistoryComponent } from './smedb-history.component';

describe('SmedbHistoryComponent', () => {
  let component: SmedbHistoryComponent;
  let fixture: ComponentFixture<SmedbHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmedbHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmedbHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
