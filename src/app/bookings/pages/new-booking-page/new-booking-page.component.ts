import { AsyncPipe, KeyValuePipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { Observable, take } from 'rxjs';
import { UrlProvider } from '../../../shared/enums/url-provider.enum';
import { HttpHandlerService } from '../../../shared/services/http-handler.service';
import { AvailableHour } from '../../interfaces/available-hour.interface';
import { Table } from '../../interfaces/table.interface';
import { TableComponent } from '../../components/table/table.component';

@Component({
  imports: [ReactiveFormsModule, KeyValuePipe, FormField, AsyncPipe, TableComponent],
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
    5: '5+',
  };

  private bookingModel = signal({
    guests: '1',
    date: new Date(),
    interval: '',
    tableNumber: 0,
  });
  private httpHandlerService = inject(HttpHandlerService);

  protected bookingForm = form(this.bookingModel);

  constructor() {
    this.availableHours$ = this.httpHandlerService.getRequest<AvailableHour[]>(
      UrlProvider.getAvailableHours,
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
  }

  onSubmitForm(event: Event): void {
    event.preventDefault();
    console.log(this.bookingModel());
  }
}
