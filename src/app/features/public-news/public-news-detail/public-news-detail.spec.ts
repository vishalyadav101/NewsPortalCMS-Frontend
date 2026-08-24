import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicNewsDetail } from './public-news-detail';

describe('PublicNewsDetail', () => {
  let component: PublicNewsDetail;
  let fixture: ComponentFixture<PublicNewsDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicNewsDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicNewsDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
