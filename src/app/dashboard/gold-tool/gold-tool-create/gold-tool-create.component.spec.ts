import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldToolCreateComponent } from './gold-tool-create.component';

describe('GoldToolCreateComponent', () => {
  let component: GoldToolCreateComponent;
  let fixture: ComponentFixture<GoldToolCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoldToolCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoldToolCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
