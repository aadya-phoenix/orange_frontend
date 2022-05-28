import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiLaunguageComponent } from './multi-launguage.component';

describe('MultiLaunguageComponent', () => {
  let component: MultiLaunguageComponent;
  let fixture: ComponentFixture<MultiLaunguageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiLaunguageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiLaunguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
