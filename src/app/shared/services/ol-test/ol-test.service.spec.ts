import { TestBed } from '@angular/core/testing';

import { OlTestService } from './ol-test.service';

describe('OlTestService', () => {
  let service: OlTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OlTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
