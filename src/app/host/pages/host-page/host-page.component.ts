import { AsyncPipe, NgTemplateOutlet, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatTab, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Booking } from '../../../new-bookings/interfaces/booking.interface';
import { UrlProvider } from '../../../shared/enums/url-provider.enum';
import { HttpHandlerService } from '../../../shared/services/http-handler.service';
import { getBookingStatusColor, getBookingStatusText } from '../../../helpers/booking-status';
import { BookingStatus } from '../../../shared/enums/booking-status.enum';
import { getTableStatusText } from '../../../helpers/table-status';

@Component({
  selector: 'host-page',
  imports: [
    MatTabGroup,
    MatTab,
    MatTabContent,
    AsyncPipe,
    NgTemplateOutlet,
    NgTemplateOutlet,
    NgClass,
  ],
  templateUrl: './host-page.component.html',
  styleUrl: './host-page.component.scss',
})
export class HostPageComponent implements OnInit {
  private readonly httpHandlerService = inject(HttpHandlerService);

  protected readonly dayOffsets = [0, 1, 2, 3];
  protected readonly dayLabels = this.dayOffsets.map((offset) => this.getDay(offset));
  protected readonly bookingsByDay: Record<number, Observable<Booking[]>> = {};

  protected bookingStatus = BookingStatus;

  ngOnInit(): void {
    this.onTabChange(0);
  }

  private fetchBookingsByDate(daysToAdd: number): Observable<Booking[]> {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);

    return this.httpHandlerService
      .getRequest<Booking[]>(UrlProvider.getBookingsByDate, {
        date: date.toISOString().slice(0, 10),
      })
      .pipe(
        map((bookings) => {
          return bookings.map((booking) => {
            return {
              ...booking,
              hour: {
                ...booking.hour,
                interval: `${booking.hour.interval.split(' - ')[0]}`,
              },
            };
          });
        }),
      );
  }

  protected updateBookingStatus(booking: Booking) {
    this.httpHandlerService
      .putRequest(
        UrlProvider.updateBookingStatus,
        { bookingId: booking.id },
        { status: BookingStatus.ACTIVE },
      )
      .subscribe();
  }

  protected loadBookingsForDay(daysToAdd: number) {
    if (!this.bookingsByDay[daysToAdd]) {
      this.bookingsByDay[daysToAdd] = this.fetchBookingsByDate(daysToAdd).pipe(shareReplay(1));
    }
  }

  protected onTabChange(index: number) {
    const dayOffset = this.dayOffsets[index];
    if (dayOffset !== undefined) {
      this.loadBookingsForDay(dayOffset);
    }
  }

  protected getBookingColor(booking: Booking): string {
    return getBookingStatusColor(booking);
  }

  protected getBookingText(booking: Booking): string {
    return getBookingStatusText(booking);
  }

  protected getTableText(booking: Booking): string {
    return getTableStatusText(booking.table);
  }

  private getDay(daysToAdd: number): string {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' });
  }
}
