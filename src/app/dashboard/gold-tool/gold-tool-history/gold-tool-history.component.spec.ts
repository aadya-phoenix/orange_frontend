import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldToolHistoryComponent } from './gold-tool-history.component';

describe('GoldToolHistoryComponent', () => {
  let component: GoldToolHistoryComponent;
  let fixture: ComponentFixture<GoldToolHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoldToolHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoldToolHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
