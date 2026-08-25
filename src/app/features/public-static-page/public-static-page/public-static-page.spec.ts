import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicStaticPage } from './public-static-page';

describe('PublicStaticPage', () => {
  let component: PublicStaticPage;
  let fixture: ComponentFixture<PublicStaticPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicStaticPage],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicStaticPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
