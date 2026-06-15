import { AsyncPipe, KeyValuePipe, NgOptimizedImage } from '@angular/common';
import { Component, effect, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { form, FormField, min, required } from '@angular/forms/signals';
import { MatDialog } from '@angular/material/dialog';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCalendar, faClock, faCompass, faCopy } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faCircleCheck, faUsers, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { map, Observable } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { UrlProvider } from '../../../shared/enums/url-provider.enum';
import { HttpHandlerService } from '../../../shared/services/http-handler.service';
import { BookingConfirmedComponent } from '../../components/booking-confirmed/booking-confirmed.component';
import { TableComponent } from '../../components/table/table.component';
import { AvailableHour } from '../../interfaces/available-hour.interface';
import { Booking } from '../../interfaces/booking.interface';
import { Table } from '../../interfaces/table.interface';

@Component({
  imports: [
    ReactiveFormsModule,
    KeyValuePipe,
    FormField,
    AsyncPipe,
    TableComponent,
    FaIconComponent,
    NgOptimizedImage,
  ],
  templateUrl: './new-booking-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './new-booking-page.component.scss',
})
export class NewBookingPageComponent {
  protected availableHours$: Observable<AvailableHour[]>;
  protected availableTables = signal<Table[]>([]);
  protected guests: Record<number, string> = {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6+',
  };

  private bookingModel = signal({
    guests: '1',
    date: new Date(),
    availableHoursId: '',
    tableNumber: 0,
  });

  protected bookingForm = form(this.bookingModel, (model) => {
    required(model.guests);
    required(model.date);
    required(model.availableHoursId);
    required(model.tableNumber);
  });

  protected faUsers = faUsers;
  protected faMap = faCompass;
  protected faUtensils = faUtensils;
  protected faCalendar = faCalendar;
  protected faClock = faClock;
  protected faCopy = faCopy;
  protected faCircleCheck = faCircleCheck;
  protected faCheck = faCheck;

  private readonly httpHandlerService = inject(HttpHandlerService);
  private readonly authService = inject(AuthService);
  private readonly matDialog = inject(MatDialog);

  protected linkCopied = signal(false);
  protected booking = signal({});

  constructor() {
    this.availableHours$ = this.httpHandlerService
      .getRequest<AvailableHour[]>(UrlProvider.getAvailableHours)
      .pipe(
        map((hours) =>
          hours.map((hour) => {
            return {
              ...hour,
              interval: hour.interval.split('-')[0].trim(),
            };
          }),
        ),
      );

    effect(() => {
      this.httpHandlerService
        .getRequest<Table[]>(UrlProvider.getAvailableTables, {
          date: this.bookingForm.date().value().toISOString().slice(0, 10),
        })
        .subscribe((tables) => {
          this.availableTables.set(tables);
        });
    });
  }

  onTableSelected(tableNumber: number): void {
    this.bookingModel.update((model) => ({ ...model, tableNumber }));
  }

  onSubmitForm(event: Event): void {
    event.preventDefault();

    if (!this.bookingForm().valid()) {
      return;
    }

    if (!this.authService.getUserDetails()) {
      this.authService.modifyLoginConfig({
        title: 'Inicio de sesión requerido',
        subtitle: 'Introduce tus credenciales para crear una reserva',
        successCallback: () => {
          this.createBooking();
        },
      });
      this.authService.showLoginModal();
      return;
    }

    if (!this.authService.getUserDetails()!.email) {
      console.log('Usuario incompleto');
      return;
    }

    this.createBooking();
  }

  private createBooking() {
    this.httpHandlerService
      .postRequest<Booking>(UrlProvider.createBooking, undefined, {
        ...this.bookingForm().value(),
        status: 'confirmed',
      })
      .subscribe((booking: Booking) => {
        this.booking.set(booking);
        this.matDialog.open(BookingConfirmedComponent, {
          data: {
            booking,
          },
          width: '22rem',
          maxWidth: '90vw',
        });
      });
  }
}
