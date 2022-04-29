import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetBackupComponent } from './set-backup.component';

describe('SetBackupComponent', () => {
  let component: SetBackupComponent;
  let fixture: ComponentFixture<SetBackupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetBackupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetBackupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
