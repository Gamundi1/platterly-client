import { AsyncPipe, KeyValuePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { form, FormField, min, required } from '@angular/forms/signals';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { DateTime } from 'luxon';

interface NewBookingFormInterface {
  guests: string;
  date: DateTime;
  availableHoursId: string;
  tableNumber: number;
}

@Component({
  imports: [
    ReactiveFormsModule,
    KeyValuePipe,
    FormField,
    AsyncPipe,
    TableComponent,
    FaIconComponent,
    NgOptimizedImage,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatProgressSpinner,
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

  private bookingModel = signal<NewBookingFormInterface>({
    guests: '1',
    date: DateTime.now(),
    availableHoursId: '',
    tableNumber: 0,
  });

  protected bookingForm = form(this.bookingModel, (model) => {
    required(model.guests);
    required(model.date);
    required(model.availableHoursId);
    required(model.tableNumber);
    min(model.tableNumber, 1);
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
  protected minDate = new Date();
  protected loading = signal(false);

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
          date: this.bookingForm.date().value().toISODate()!.slice(0, 10),
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
    this.loading.set(true);
    this.httpHandlerService
      .postRequest<Booking>(UrlProvider.createBooking, undefined, {
        ...this.bookingForm().value(),
        status: 'confirmed',
      })
      .subscribe((booking: Booking) => {
        this.booking.set(booking);
        this.loading.set(false);
        this.matDialog.open(BookingConfirmedComponent, {
          data: {
            booking,
          },
          panelClass: 'fullscreen',
          disableClose: true,
        });
      });
  }
}
