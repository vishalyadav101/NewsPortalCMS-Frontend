import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicComments } from './public-comments';

describe('PublicComments', () => {
  let component: PublicComments;
  let fixture: ComponentFixture<PublicComments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicComments],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicComments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
