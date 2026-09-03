import { Component, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import {
  MatDatepickerModule
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-booking-incentive',
  templateUrl: './booking-incentive.component.html',
  styleUrls: ['./booking-incentive.component.scss'],
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, FormField, TranslocoPipe],
})
export class BookingIncentiveComponent {
  bookinIncentiveModel = signal({
    date: '',
    guests: 1,
  });
  bookingIncentiveForm = form(this.bookinIncentiveModel, (model) => {
    (required(model.date), required(model.guests));
  });
  protected readonly minDate = new Date();
}
