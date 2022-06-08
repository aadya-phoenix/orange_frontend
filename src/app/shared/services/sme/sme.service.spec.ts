import { TestBed } from '@angular/core/testing';

import { SMEService } from './sme.service';

describe('SMEService', () => {
  let service: SMEService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SMEService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
