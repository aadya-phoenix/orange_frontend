import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContcatUsComponent } from './contcat-us.component';

describe('ContcatUsComponent', () => {
  let component: ContcatUsComponent;
  let fixture: ComponentFixture<ContcatUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContcatUsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContcatUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
