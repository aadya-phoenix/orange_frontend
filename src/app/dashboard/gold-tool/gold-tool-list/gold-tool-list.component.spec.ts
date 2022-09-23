import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldToolListComponent } from './gold-tool-list.component';

describe('GoldToolListComponent', () => {
  let component: GoldToolListComponent;
  let fixture: ComponentFixture<GoldToolListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoldToolListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoldToolListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
