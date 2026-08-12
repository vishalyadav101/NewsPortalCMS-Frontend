import { TestBed } from '@angular/core/testing';

import { WebsiteSetting } from './website-setting';

describe('WebsiteSetting', () => {
  let service: WebsiteSetting;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsiteSetting);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
