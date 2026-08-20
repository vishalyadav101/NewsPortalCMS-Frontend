import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsReport } from './comments-report';

describe('CommentsReport', () => {
  let component: CommentsReport;
  let fixture: ComponentFixture<CommentsReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentsReport],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentsReport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
