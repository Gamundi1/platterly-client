import { AsyncPipe, DatePipe, NgTemplateOutlet, NgClass } from '@angular/common';
import { Component, inject, TemplateRef, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, Subject } from 'rxjs';
import { Booking } from '../../../new-bookings/interfaces/booking.interface';
import { UrlProvider } from '../../../shared/enums/url-provider.enum';
import { HttpHandlerService } from '../../../shared/services/http-handler.service';
import { BookingStatus } from '../../../shared/enums/booking-status.enum';
import { MatExpansionModule } from '@angular/material/expansion';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faArrowRight,
  faChair,
  faClose,
  faUserPlus,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { MatDialog, MatDialogClose } from '@angular/material/dialog';
import { InvitationButtonComponent } from '../../../shared/components/invitation-button/invitation-button.component';
import { isDateAfterOrBefore } from '../../../helpers/date.helper';
import { TimeInterval } from '../../../shared/enums/time-interval.enum';
import { getBookingStatusColor, getBookingStatusText } from '../../../helpers/booking-status';

@Component({
  imports: [
    AsyncPipe,
    NgTemplateOutlet,
    DatePipe,
    NgClass,
    InvitationButtonComponent,
    MatExpansionModule,
    FaIconComponent,
    MatDialogClose,
  ],
  templateUrl: './my-bookings-page.component.html',
  styleUrl: './my-bookings-page.component.scss',
})
export class MyBookingsPage {
  protected userActiveBookings$: Subject<Booking[]> = new Subject<Booking[]>();
  protected userComingBookings$: Subject<Booking[]> = new Subject<Booking[]>();
  protected userPastBookings$: Subject<Booking[]> = new Subject<Booking[]>();

  protected readonly faChair = faChair;
  protected readonly faCircleXMark = faCircleXmark;
  protected readonly faUserPlus = faUserPlus;
  protected readonly faClose = faXmark;
  protected readonly faArrowRight = faArrowRight;

  private readonly httpHandlerService = inject(HttpHandlerService);
  private readonly matDialog = inject(MatDialog);
  private readonly invitationModal = viewChild<TemplateRef<any>>('invitationModal');
  protected bookingStatus = BookingStatus;

  constructor() {
    this.getUserBookings();
  }

  getUserBookings() {
    return this.httpHandlerService
      .getRequest<Booking[]>(UrlProvider.getUserBookings)
      .pipe(
        map((bookings) => {
          return bookings.map((booking) => {
            return {
              ...booking,
              date: new Date(booking.date),
            };
          });
        }),
        map((bookings) => {
          const activeBookings = bookings.filter(
            (booking) => booking.status === BookingStatus.ACTIVE,
          );
          console.log(activeBookings);

          const comingBookings = bookings.filter((booking) => {
            const bookingDate = booking.date;

            if (
              (isDateAfterOrBefore(bookingDate, booking.hour) === TimeInterval.AFTER ||
                isDateAfterOrBefore(bookingDate, booking.hour) === TimeInterval.WITHIN) &&
              booking.status !== BookingStatus.CANCELLED &&
              booking.status !== BookingStatus.ACTIVE
            ) {
              return true;
            }

            return false;
          });

          const pastBookings = bookings.filter((booking) => {
            const bookingDate = booking.date;

            if (
              (isDateAfterOrBefore(bookingDate, booking.hour) === TimeInterval.BEFORE ||
                booking.status === BookingStatus.CANCELLED) &&
              booking.status !== BookingStatus.ACTIVE
            ) {
              return true;
            }

            return false;
          });

          this.userComingBookings$.next(comingBookings);
          this.userPastBookings$.next(pastBookings);
          this.userActiveBookings$.next(activeBookings);
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  getBookingColor(booking: Booking): string {
    return getBookingStatusColor(booking);
  }

  getBookingStatus(booking: Booking): string {
    return getBookingStatusText(booking);
  }

  openInvitationModal(booking: Booking) {
    this.matDialog.open(this.invitationModal()!, {
      data: booking,
      width: '22rem',
      height: '12rem',
    });
  }

  getGuestSlots(booking: Booking): string[] {
    const remaining = this.getRemainingSlots(booking);
    const filled = this.getFilledSlots(booking);
    return [...filled, ...Array(remaining).fill('Sin Asignar')];
  }

  getRemainingSlots(booking: Booking): number {
    const totalSlots = Math.max(0, booking.guests ?? 0);
    const remaining = Math.max(0, totalSlots - this.getFilledSlots(booking).length);

    return remaining;
  }

  getFilledSlots(booking: Booking): string[] {
    const totalSlots = Math.max(0, booking.guests ?? 0);
    const occupied = Array.isArray(booking.users) ? booking.users : [];
    const filled = occupied.slice(0, totalSlots).map((user) => String(user.name));

    return filled;
  }

  cancelBooking(booking: Booking) {
    this.httpHandlerService
      .putRequest(
        UrlProvider.updateBookingStatus,
        { bookingId: booking.id },
        { status: BookingStatus.CANCELLED },
      )
      .subscribe();
  }
}
