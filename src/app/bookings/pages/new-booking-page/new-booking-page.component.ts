import { AsyncPipe, DatePipe, KeyValuePipe, NgOptimizedImage } from '@angular/common';
import { Component, effect, inject, signal, TemplateRef, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { form, FormField, min, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCalendar, faClock, faCompass } from '@fortawesome/free-regular-svg-icons';
import { faInfoCircle, faUsers, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { map, Observable, take } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { UrlProvider } from '../../../shared/enums/url-provider.enum';
import { HttpHandlerService } from '../../../shared/services/http-handler.service';
import { ModalService } from '../../../shared/services/modal.service';
import { TableComponent } from '../../components/table/table.component';
import { AvailableHour } from '../../interfaces/available-hour.interface';
import { Table } from '../../interfaces/table.interface';

@Component({
  imports: [
    ReactiveFormsModule,
    KeyValuePipe,
    FormField,
    AsyncPipe,
    TableComponent,
    FaIconComponent,
    DatePipe,
    RouterLink,
    NgOptimizedImage,
  ],
  templateUrl: './new-booking-page.component.html',
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
    min(model.guests, 1);
  });

  protected faUsers = faUsers;
  protected faMap = faCompass;
  protected faUtensils = faUtensils;
  protected faCalendar = faCalendar;
  protected faClock = faClock;

  private readonly successfulBookingTemplate = viewChild<TemplateRef<unknown>>('successfulBooking');

  private readonly httpHandlerService = inject(HttpHandlerService);
  private readonly authService = inject(AuthService);
  private readonly modalService = inject(ModalService);

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
        .pipe(take(1))
        .subscribe((tables) => {
          this.availableTables.set(tables);
        });
    });
  }

  onTableSelected(tableNumber: number): void {
    this.bookingModel.update((model) => ({ ...model, tableNumber }));
    this.modalService.showModal(this.successfulBookingTemplate()!);
  }

  getSelectedHourInterval(): string {
    return '09:00';
  }

  onSubmitForm(event: Event): void {
    event.preventDefault();

    if (!this.bookingForm().valid()) {
      return;
    }

    if (!this.authService.getUserDetails()) {
      this.authService.showLoginModal();
      return;
    }

    this.httpHandlerService
      .postRequest(UrlProvider.createBooking, undefined, {
        ...this.bookingForm().value(),
        status: 'confirmed',
      })
      .subscribe(() => {
        this.modalService.showModal(this.successfulBookingTemplate()!);
      });
  }
}
