import { TestBed } from '@angular/core/testing';

import { DnaService } from './dna.service';

describe('DnaService', () => {
  let service: DnaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DnaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
