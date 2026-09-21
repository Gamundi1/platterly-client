import { Component, inject, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-incentive',
  templateUrl: './booking-incentive.component.html',
  styleUrls: ['./booking-incentive.component.scss'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormField,
    TranslocoPipe,
    MatSelectModule,
    MatIconModule,
  ],
})
export class BookingIncentiveComponent {
  private readonly router = inject(Router);

  bookinIncentiveModel = signal({
    date: '',
    guests: 1,
  });
  bookingIncentiveForm = form(this.bookinIncentiveModel, (model) => {
    (required(model.date), required(model.guests));
  });

  guests = [
    { value: 1, label: '1 Invitado' },
    { value: 2, label: '2 Invitados' },
    { value: 3, label: '3 Invitados' },
    { value: 4, label: '4 Invitados' },
    { value: 5, label: '5 Invitados' },
  ];

  protected readonly minDate = new Date();

  protected onFormSubmit(event: Event) {
    event.preventDefault();
    if (this.bookingIncentiveForm().valid()) {
      this.router.navigate(['/bookings'], {
        queryParams: {
          date: this.bookingIncentiveForm().value().date,
          guests: this.bookingIncentiveForm().value().guests,
        },
      });
    }
  }
}
