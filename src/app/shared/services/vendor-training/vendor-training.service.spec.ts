import { TestBed } from '@angular/core/testing';

import { VendorTrainingService } from './vendor-training.service';

describe('VendorTrainingService', () => {
  let service: VendorTrainingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendorTrainingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
