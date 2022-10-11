import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldToolAgreeComponent } from './gold-tool-agree.component';

describe('GoldToolAgreeComponent', () => {
  let component: GoldToolAgreeComponent;
  let fixture: ComponentFixture<GoldToolAgreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoldToolAgreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoldToolAgreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
