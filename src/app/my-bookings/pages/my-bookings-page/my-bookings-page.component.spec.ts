import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBookingsPage } from './my-bookings-page.component';

describe('MyBookingsPage', () => {
  let component: MyBookingsPage;
  let fixture: ComponentFixture<MyBookingsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyBookingsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(MyBookingsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
