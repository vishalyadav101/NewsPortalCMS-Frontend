import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicNewsList } from './public-news-list';

describe('PublicNewsList', () => {
  let component: PublicNewsList;
  let fixture: ComponentFixture<PublicNewsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicNewsList],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicNewsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
