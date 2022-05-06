import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackOfficeTransferToOtherRocComponent } from './back-office-transfer-to-other-roc.component';

describe('BackOfficeTransferToOtherRocComponent', () => {
  let component: BackOfficeTransferToOtherRocComponent;
  let fixture: ComponentFixture<BackOfficeTransferToOtherRocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackOfficeTransferToOtherRocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackOfficeTransferToOtherRocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
