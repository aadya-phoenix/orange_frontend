import { TestBed } from '@angular/core/testing';

import { GoldToolService } from './gold-tool.service';

describe('GoldToolService', () => {
  let service: GoldToolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoldToolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
