import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldToolViewComponent } from './gold-tool-view.component';

describe('GoldToolViewComponent', () => {
  let component: GoldToolViewComponent;
  let fixture: ComponentFixture<GoldToolViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoldToolViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoldToolViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
