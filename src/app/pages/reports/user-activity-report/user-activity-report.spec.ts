import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActivityReport } from './user-activity-report';

describe('UserActivityReport', () => {
  let component: UserActivityReport;
  let fixture: ComponentFixture<UserActivityReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserActivityReport],
    }).compileComponents();

    fixture = TestBed.createComponent(UserActivityReport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
