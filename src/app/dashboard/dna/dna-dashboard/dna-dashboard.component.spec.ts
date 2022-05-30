import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DnaDashboardComponent } from './dna-dashboard.component';

describe('DnaDashboardComponent', () => {
  let component: DnaDashboardComponent;
  let fixture: ComponentFixture<DnaDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DnaDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DnaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
