import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteSettings } from './website-settings';

describe('WebsiteSettings', () => {
  let component: WebsiteSettings;
  let fixture: ComponentFixture<WebsiteSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsiteSettings],
    }).compileComponents();

    fixture = TestBed.createComponent(WebsiteSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
