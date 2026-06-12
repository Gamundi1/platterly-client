import { DatePipe } from '@angular/common';
import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCalendar, faCircleCheck, faClock } from '@fortawesome/free-regular-svg-icons';
import { InvitationButtonComponent } from '../../../shared/components/invitation-button/invitation-button.component';
import { Booking } from '../../interfaces/booking.interface';

@Component({
  templateUrl: './booking-confirmed.component.html',
  styleUrl: './booking-confirmed.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FaIconComponent, DatePipe, InvitationButtonComponent, RouterLink],
})
export class BookingConfirmedComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { booking: Booking }) {}

  protected readonly faCircleCheck = faCircleCheck;
  protected readonly faCalendar = faCalendar;
  protected readonly faClock = faClock;
}
