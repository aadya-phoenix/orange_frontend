import { TestBed } from '@angular/core/testing';

import { DesignLearningService } from './design-learning.service';

describe('DesignLearningService', () => {
  let service: DesignLearningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesignLearningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
