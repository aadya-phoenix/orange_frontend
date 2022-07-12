import { TestBed } from '@angular/core/testing';

import { PldtoolsService } from './pldtools.service';

describe('PldtoolsService', () => {
  let service: PldtoolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PldtoolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
