import { TestBed } from '@angular/core/testing';

import { BackOfficeService } from './back-office.service';

describe('CarouselService', () => {
  let service: BackOfficeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackOfficeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
